// import { ProxyStateTree } from 'proxy-state-tree';
// import { isPlainObject, isPromise, appToPath } from './utils';

export type ErrorFunction<Param, ExecutableType> = (params: Param) => ExecutableType;

export type HandlerExits<ExecutableType, OnErroParams, Output> = {
  resolve(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>, isInError: boolean): Output;
  resolveAsync(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>, isInError: boolean): void;
  reject(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any, isInError: boolean): Output;
  rejectAsync(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any, isInError: boolean): void;
};

type ExecutionMatcher<Exec> = (exec: any) => exec is Exec;
type ExecutionHandler<ExecutableType, Exec, OnErroParams, HandlerOutput> = (
  exec: Exec,
  onError: ErrorFunction<OnErroParams, ExecutableType>,
  isInError: boolean,
  exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
) => HandlerOutput;

export type Registered<ExecutableType, Exec, OnErroParams, HandlerOutput> = {
  matcher: ExecutionMatcher<Exec>;
  handler: ExecutionHandler<ExecutableType, Exec, OnErroParams, HandlerOutput>;
};

/**
 * Operator Creators
 */

type ExecutionOptions<ExecutableType, OnErroParams, HandlerOutput> = {
  onFrameEnd: (output: HandlerOutput) => void;
  onError: ErrorFunction<OnErroParams, ExecutableType>;
  getOnErrorParams: (error: any) => OnErroParams;
  unknownHandlerOutput: (exec: any, exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>) => HandlerOutput;
  unknownHandlerHook?: (
    exec: any,
    next: (transformed: any) => HandlerOutput,
    onError: ErrorFunction<OnErroParams, ExecutableType>,
    isInError: boolean,
    exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
  ) => HandlerOutput;
};

export function createExecution<ExecutableType, OnErroParams, HandlerOutput>(
  options: ExecutionOptions<ExecutableType, OnErroParams, HandlerOutput>,
  initialRegistered: Array<Registered<ExecutableType, any, OnErroParams, HandlerOutput>> = []
) {
  const { onError: defaultOnError, onFrameEnd, getOnErrorParams, unknownHandlerHook, unknownHandlerOutput } = options;

  let registered: Array<Registered<ExecutableType, any, OnErroParams, HandlerOutput>> = [...initialRegistered];
  let handlerExits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput> = {
    resolve,
    resolveAsync,
    reject,
    rejectAsync,
  };

  function resolveAsync(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>, isInError: boolean): void {
    const output = resolve(exec, onError, isInError);
    onFrameEnd(output);
  }

  function rejectAsync(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any, isInError: boolean): void {
    // if onError throw an error
    if (isInError && onError === defaultOnError) {
      throw error;
    }
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    resolveAsync(errorResult, defaultOnError, true);
  }

  function reject(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any, isInError: boolean): HandlerOutput {
    // if onError throw an error
    if (isInError && onError === defaultOnError) {
      throw error;
    }
    const errorResult = onError(getOnErrorParams(error));
    const erroName = (onError as any).displayName || onError.name || 'onError';
    return resolve(errorResult, defaultOnError, true);
  }

  function resolve(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>, isInError: boolean): HandlerOutput {
    let customExecResult: HandlerOutput = null as any;
    const customExecUsed = registered.some(reg => {
      if (reg.matcher(exec)) {
        customExecResult = reg.handler(exec, onError, isInError, handlerExits);
        return true;
      }
      return false;
    });
    if (customExecUsed) {
      return customExecResult;
    }

    // Unknown
    console.log('unknown');
    console.log(exec);
    const next = (transformed: any) => unknownHandlerOutput(exec, handlerExits);
    return unknownHandlerHook ? unknownHandlerHook(exec, next, onError, isInError, handlerExits) : next(exec);
  }

  function run(action: ExecutableType): void {
    resolveAsync(action, defaultOnError, false);
  }

  function register<Exec>(reg: Registered<ExecutableType, Exec, OnErroParams, HandlerOutput>): () => void {
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
