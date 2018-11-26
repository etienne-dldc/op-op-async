import { ProxyStateTree } from 'proxy-state-tree';
import { isPlainObject, isPromise, appToPath } from './utils';

export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny = {
  [IS_EXECUTABLE]: true;
};

type ExecutableNoCircular = null | ExecutableAny | ObjectOfExecutable;

type Path = Array<string | number>;

export type Executable = ExecutableNoCircular | ArrayOfExecutable | Promise<ExecutableNoCircular>;

type ArrayOfExecutable = Array<ExecutableNoCircular | Promise<ExecutableNoCircular>>;

type ErrorFunction<Param> = (params: Param) => Executable;

type ObjectOfExecutable = {
  [key: string]: Executable;
};

/**
 * Execution Handlers
 */

type BasicHandlerContext<OnErroParams, ExecutionHandlerOutput> = {
  resolve(exec: any, path: Path, onError: ErrorFunction<OnErroParams>): ExecutionHandlerOutput;
  resolveAsync(exec: any, path: Path, onError: ErrorFunction<OnErroParams>): void;
  reject(onError: ErrorFunction<OnErroParams>, error: any, path: Path): ExecutionHandlerOutput;
  rejectAsync(onError: ErrorFunction<OnErroParams>, error: any, path: Path): void;
};
type ExecutionMatcher<Exec> = (exec: any) => exec is Exec;
type ExecutionHandler<OnErroParams, ExecutionHandlerOutput, Exec> = (
  exec: Exec,
  ctx: BasicHandlerContext<OnErroParams, ExecutionHandlerOutput>
) => ExecutionHandlerOutput;

type Registered<OnErroParams, ExecutionHandlerOutput, Exec> = {
  matcher: ExecutionMatcher<Exec>;
  handler: ExecutionHandler<OnErroParams, ExecutionHandlerOutput, Exec>;
};

/**
 * Operator Creators
 */

export function asExecutable(exec: any): ExecutableAny {
  return exec as any;
}

type BasicHandlerOutputs<
  OnErroParams,
  HandlerOutput,
  HandlerContext extends BasicHandlerContext<OnErroParams, HandlerOutput>
> = {
  null: (context: HandlerContext) => HandlerOutput;
  promise: (promise: Promise<any>, context: HandlerContext) => HandlerOutput;
  array: (outputs: Array<HandlerOutput>, context: HandlerContext) => HandlerOutput;
  object: (outputs: { [key: string]: HandlerOutput }, context: HandlerContext) => HandlerOutput;
  noMatch: (exec: any, context: HandlerContext) => HandlerOutput;
};

type BasicHandlerHooks<
  OnErroParams,
  HandlerOutput,
  HandlerContext extends BasicHandlerContext<OnErroParams, HandlerOutput>
> = {
  null?: (next: () => HandlerOutput, path: Path, context: HandlerContext) => HandlerOutput;
  promise?: (
    promise: Promise<any>,
    next: (transformed: Promise<any>) => HandlerOutput,
    path: Path,
    context: HandlerContext
  ) => HandlerOutput;
  array?: (
    outputs: Array<any>,
    next: (transformed: Array<any>) => HandlerOutput,
    path: Path,
    context: HandlerContext
  ) => HandlerOutput;
  object?: (
    outputs: { [key: string]: any },
    next: (transformed: { [key: string]: any }) => HandlerOutput,
    path: Path,
    context: HandlerContext
  ) => HandlerOutput;
  noMatch?: (
    exec: any,
    next: (transformed: any) => HandlerOutput,
    path: Path,
    context: HandlerContext
  ) => HandlerOutput;
};

type ExecutionOptions<
  OnErroParams,
  HandlerOutput,
  HandlerContext extends BasicHandlerContext<OnErroParams, HandlerOutput>
> = {
  onFrameEnd: (output: HandlerOutput) => void;
  onError: ErrorFunction<OnErroParams>;
  getOnErrorParams: (error: any) => OnErroParams;
  createHandlerContext: (basicContext: BasicHandlerContext<OnErroParams, HandlerOutput>) => HandlerContext;
  basicHandlerOutputs: BasicHandlerOutputs<OnErroParams, HandlerOutput, HandlerContext>;
  basicHandlerHooks?: BasicHandlerHooks<OnErroParams, HandlerOutput, HandlerContext>;
};

export function createExecution<
  OnErroParams,
  HandlerOutput,
  HandlerContext extends BasicHandlerContext<OnErroParams, HandlerOutput> = BasicHandlerContext<
    OnErroParams,
    HandlerOutput
  >
>(
  options: ExecutionOptions<OnErroParams, HandlerOutput, HandlerContext>,
  initialRegistered: Array<Registered<OnErroParams, HandlerOutput, any>> = []
) {
  const {
    onError: defaultOnError,
    onFrameEnd,
    getOnErrorParams,
    basicHandlerHooks = {},
    createHandlerContext,
    basicHandlerOutputs,
  } = options;

  let registered: Array<Registered<OnErroParams, HandlerOutput, any>> = [...initialRegistered];
  let handlerContext: HandlerContext = createHandlerContext({
    resolve,
    resolveAsync,
    reject,
    rejectAsync,
  });
  let onRunEnd: (() => void) | null = null;

  function resolveAsync(exec: any, path: Path, onError: ErrorFunction<OnErroParams>): void {
    const output = resolve(exec, path, onError);
    onFrameEnd(output);
  }

  function rejectAsync(onError: ErrorFunction<OnErroParams>, error: any, path: Path): void {
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    resolveAsync(errorResult, [...path, erroName], defaultOnError);
  }

  function reject(onError: ErrorFunction<OnErroParams>, error: any, path: Path): HandlerOutput {
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    return resolve(errorResult, [...path, erroName], defaultOnError);
  }

  function resolve(exec: any, path: Path, onError: ErrorFunction<OnErroParams>): HandlerOutput {
    console.log(path);

    if (exec === null) {
      console.log('null');
      const next = () => basicHandlerOutputs.null(handlerContext);
      return basicHandlerHooks.null ? basicHandlerHooks.null(next, path, handlerContext) : next();
    }
    if (isPromise(exec)) {
      console.log('promise');
      const next = (transformed: Promise<any>) =>
        basicHandlerOutputs.promise(
          transformed
            .then(subResult => resolveAsync(subResult, [...path, 'resolved'], onError))
            .catch(error => {
              rejectAsync(onError, error, [...path, 'rejected']);
            }),
          handlerContext
        );
      return basicHandlerHooks.promise ? basicHandlerHooks.promise(exec, next, path, handlerContext) : next(exec);
    }
    if (Array.isArray(exec)) {
      const next = (transformed: Array<any>) =>
        basicHandlerOutputs.array(
          transformed.map((item, index) => {
            return resolve(item, appToPath(path, index), onError);
          }),
          handlerContext
        );
      return basicHandlerHooks.array ? basicHandlerHooks.array(exec, next, path, handlerContext) : next(exec);
    }

    let customExecResult: HandlerOutput = null as any;
    const customExecUsed = registered.some(reg => {
      if (reg.matcher(exec)) {
        customExecResult = reg.handler(exec, handlerContext);
        return true;
      }
      return false;
    });
    if (customExecUsed) {
      return customExecResult;
    }

    if (isPlainObject(exec)) {
      console.log('plain object');
      const next = (transformed: { [key: string]: any }) =>
        basicHandlerOutputs.object(
          Object.keys(transformed).reduce(
            (acc, key) => {
              acc[key] = resolve(transformed[key], appToPath(path, key), onError);
              return acc;
            },
            {} as any
          ),
          handlerContext
        );
      return basicHandlerHooks.object ? basicHandlerHooks.object(exec, next, path, handlerContext) : next(exec);
    }

    console.log('unknon');
    console.log(exec);
    const next = (transformed: any) => basicHandlerOutputs.noMatch(exec, handlerContext);
    return basicHandlerHooks.noMatch ? basicHandlerHooks.noMatch(exec, next, path, handlerContext) : next(exec);
  }

  function run(action: Executable): void {
    resolveAsync(action, [], defaultOnError);
  }

  function register<Exec>(reg: Registered<OnErroParams, HandlerOutput, Exec>): () => void {
    registered = [...registered, reg];
    const unregisterExecution = () => {
      const index = registered.indexOf(reg);
      if (index > -1) {
        registered.splice(index, 1);
      }
    };
    return unregisterExecution;
  }

  return {
    run,
    register,
  };
}
