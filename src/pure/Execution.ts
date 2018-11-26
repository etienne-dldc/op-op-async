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

type BasicHandlerContext<OnErroParams, Output> = {
  resolve(exec: any, path: Path, onError: ErrorFunction<OnErroParams>, isInError: boolean): Output;
  resolveAsync(exec: any, path: Path, onError: ErrorFunction<OnErroParams>, isInError: boolean): void;
  reject(onError: ErrorFunction<OnErroParams>, error: any, path: Path, isInError: boolean): Output;
  rejectAsync(onError: ErrorFunction<OnErroParams>, error: any, path: Path, isInError: boolean): void;
};
type ExecutionMatcher<Exec> = (exec: any) => exec is Exec;
type ExecutionHandler<OnErroParams, Output, Exec> = (
  exec: Exec,
  path: Path,
  onError: ErrorFunction<OnErroParams>,
  isInError: boolean,
  ctx: BasicHandlerContext<OnErroParams, Output>
) => Output;

type Registered<OnErroParams, Output, Exec> = {
  matcher: ExecutionMatcher<Exec>;
  handler: ExecutionHandler<OnErroParams, Output, Exec>;
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
  unknown: (exec: any, context: HandlerContext) => HandlerOutput;
};

type BasicHandlerHooks<
  OnErroParams,
  HandlerOutput,
  HandlerContext extends BasicHandlerContext<OnErroParams, HandlerOutput>
> = {
  null?: (
    next: () => HandlerOutput,
    path: Path,
    onError: ErrorFunction<OnErroParams>,
    isInError: boolean,
    context: HandlerContext
  ) => HandlerOutput;
  promise?: (
    promise: Promise<any>,
    next: (transformed: Promise<any>) => HandlerOutput,
    path: Path,
    onError: ErrorFunction<OnErroParams>,
    isInError: boolean,
    context: HandlerContext
  ) => HandlerOutput;
  array?: (
    outputs: Array<any>,
    next: (transformed: Array<any>) => HandlerOutput,
    path: Path,
    onError: ErrorFunction<OnErroParams>,
    isInError: boolean,
    context: HandlerContext
  ) => HandlerOutput;
  object?: (
    outputs: { [key: string]: any },
    next: (transformed: { [key: string]: any }) => HandlerOutput,
    path: Path,
    onError: ErrorFunction<OnErroParams>,
    isInError: boolean,
    context: HandlerContext
  ) => HandlerOutput;
  unknown?: (
    exec: any,
    next: (transformed: any) => HandlerOutput,
    path: Path,
    onError: ErrorFunction<OnErroParams>,
    isInError: boolean,
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

  function resolveAsync(exec: any, path: Path, onError: ErrorFunction<OnErroParams>, isInError: boolean): void {
    const output = resolve(exec, path, onError, isInError);
    onFrameEnd(output);
  }

  function rejectAsync(onError: ErrorFunction<OnErroParams>, error: any, path: Path, isInError: boolean): void {
    // if onError throw an error
    if (isInError && onError === defaultOnError) {
      throw error;
    }
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    resolveAsync(errorResult, [...path, erroName], defaultOnError, true);
  }

  function reject(onError: ErrorFunction<OnErroParams>, error: any, path: Path, isInError: boolean): HandlerOutput {
    // if onError throw an error
    if (isInError && onError === defaultOnError) {
      throw error;
    }
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    return resolve(errorResult, [...path, erroName], defaultOnError, true);
  }

  function resolve(exec: any, path: Path, onError: ErrorFunction<OnErroParams>, isInError: boolean): HandlerOutput {
    console.log(path);

    let customExecResult: HandlerOutput = null as any;
    const customExecUsed = registered.some(reg => {
      if (reg.matcher(exec)) {
        customExecResult = reg.handler(exec, path, onError, isInError, handlerContext);
        return true;
      }
      return false;
    });
    if (customExecUsed) {
      return customExecResult;
    }

    // Null
    if (exec === null) {
      console.log('null');
      const next = () => basicHandlerOutputs.null(handlerContext);
      return basicHandlerHooks.null ? basicHandlerHooks.null(next, path, onError, isInError, handlerContext) : next();
    }

    // Promise
    if (isPromise(exec)) {
      console.log('promise');
      const next = (transformed: Promise<any>) =>
        basicHandlerOutputs.promise(
          transformed
            .then(subResult => resolveAsync(subResult, [...path, 'resolved'], onError, isInError))
            .catch(error => {
              rejectAsync(onError, error, [...path, 'rejected'], isInError);
            }),
          handlerContext
        );
      return basicHandlerHooks.promise
        ? basicHandlerHooks.promise(exec, next, path, onError, isInError, handlerContext)
        : next(exec);
    }

    // Array
    if (Array.isArray(exec)) {
      const next = (transformed: Array<any>) =>
        basicHandlerOutputs.array(
          transformed.map((item, index) => {
            return resolve(item, appToPath(path, index), onError, isInError);
          }),
          handlerContext
        );
      return basicHandlerHooks.array
        ? basicHandlerHooks.array(exec, next, path, onError, isInError, handlerContext)
        : next(exec);
    }

    // Object
    if (isPlainObject(exec)) {
      console.log('plain object');
      const next = (transformed: { [key: string]: any }) =>
        basicHandlerOutputs.object(
          Object.keys(transformed).reduce(
            (acc, key) => {
              acc[key] = resolve(transformed[key], appToPath(path, key), onError, isInError);
              return acc;
            },
            {} as any
          ),
          handlerContext
        );
      return basicHandlerHooks.object
        ? basicHandlerHooks.object(exec, next, path, onError, isInError, handlerContext)
        : next(exec);
    }

    // Unknown
    console.log('unknown');
    console.log(exec);
    const next = (transformed: any) => basicHandlerOutputs.unknown(exec, handlerContext);
    return basicHandlerHooks.unknown
      ? basicHandlerHooks.unknown(exec, next, path, onError, isInError, handlerContext)
      : next(exec);
  }

  function run(action: Executable): void {
    resolveAsync(action, [], defaultOnError, false);
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
