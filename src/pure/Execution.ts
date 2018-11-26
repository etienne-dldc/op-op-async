import { isPromise } from './utils';

type Exit<Context> = (executable: any, context: Context) => Context;

export type Exits<Context> = {
  handle: Exit<Context>;
  handleAsync: Exit<Context>;
};

export type OppError = any;

export type Handler<Context> = (executable: any, context: Context, exits: Exits<Context>) => Context;

export function createHandler<Context>(handler: Handler<Context>): Handler<Context> {
  return handler;
}

// =====
// =====
// =====
// =====

type Path = Array<string | number>;
type Executable = any;

type Context = {
  path: Path;
  onError: Executable;
};

function createNextContext(ctx: Context, part: string | number | null = null, onError?: Executable): Context {
  const nextPath = part === null ? ctx.path : [...ctx.path, part];
  console.log(nextPath);
  if (part === null && !onError) {
    return ctx;
  }
  return {
    ...ctx,
    onError: onError || ctx.onError,
    path: nextPath,
  };
}

const handleNull = createHandler<Context>((executable, ctx, { handle }) => {
  if (executable === null) {
    return createNextContext(ctx, 'null');
  }
  return handle(executable, ctx);
});

type Attemps = {
  displayName: string;
  attempt: Executable;
  onError: Executable;
};

function isAttempt(executable: any): executable is Attemps {
  return true;
}

const handleAttempt = createHandler<Context>((executable, ctx, { handle }) => {
  if (isAttempt(executable)) {
    const result = handle(executable.attempt, createNextContext(ctx, 'attempt', executable.onError));
    return result;
  }
  return handle(executable, ctx);
});

const handlePromise = createHandler<Context>((executable, ctx, { handle, handleAsync }) => {
  if (isPromise(executable)) {
    const promiseCtx = createNextContext(ctx, 'promise');
    executable.then(val => handleAsync(val, createNextContext(promiseCtx, 'resolved'))).catch(err => {});
    return promiseCtx;
  }
  return handle(executable, ctx);
});

const handleArray = createHandler<Context>((executable, ctx, { handle }) => {
  if (Array.isArray(executable)) {
    const arrContext = createNextContext(ctx, 'array');
    const contexts = executable.map((exec, index) => handle(exec, createNextContext(arrContext, index)));
    return arrContext;
  }
  return handle(executable, ctx);
});

function pipe<Context>(...handlers: Array<Handler<Context>>): Handler<Context> {
  return createHandler((executable, context, exits) => {
    let ctx = context;
    const createExits = (nextOperatorIndex: number, exits: Exits<any>, ctx: Context): Exits<Context> => {
      const nextHandler = handlers[nextOperatorIndex];
      return {
        handle: (nextExec, nextCtx) => {
          if (nextHandler) {
            return nextHandler(nextExec, nextCtx, createExits(nextOperatorIndex + 1, exits, nextCtx));
          }
          return exits.handle(nextExec, nextCtx);
        },
        handleAsync: (nextExec, nextCtx) => {
          if (nextHandler) {
            return nextHandler(nextExec, nextCtx, createExits(nextOperatorIndex + 1, exits, nextCtx));
          }
          return exits.handleAsync(nextExec, nextCtx);
        },
      };
    };
    return handlers[0](executable, ctx, createExits(1, exits, ctx));
  });
}

const handleAll = pipe(
  handleArray,
  handleNull,
  handlePromise
);

function run<Context>(handler: Handler<Context>, executable: Executable, inititlaContext: Context): Context {
  const handle: Exit<Context> = (exec, ctx) => {
    return handler(exec, ctx, {
      handle: handle,
      handleAsync: (exec, ctx) => {
        const asyncResult = handle(exec, ctx);
        console.log('async: ', asyncResult);
        return asyncResult;
      },
    });
  };
  const result = handle(executable, inititlaContext);
  console.log('sync', result);
  return result;
}

const result = run(handleAll, [Promise.resolve(null)], { path: [], onError: null });

// handleAll([Promise.resolve(null)], { path: [], onError: null }, {
//   handle: (executable, ctx) => {
//     console.log('Unsuported', executable);
//     return handleAll(executable, ctx, );
//   },
//   handleAsync: ()
// })

// =============
// =============
// =============
// =============
// =============
// =============
// =============

// export type HandlerExits<ExecutableType, OnErroParams, SuccessOutput> = {
//   resolve(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>): SuccessContext;
//   resolveAsync(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>): SuccessContext;
//   reject(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any): ErrorContext;
//   rejectAsync(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any): ErrorContext;
// };

// type ExecutionMatcher<Executable> = (exec: any) => exec is Executable;
// type ExecutionHandler<ExecutableType, Exec, OnErroParams, Context> = (
//   executable: Exec,
//   onError: ErrorFunction<OnErroParams, ExecutableType>,
//   exits: HandlerExits<ExecutableType, OnErroParams, Context>
// ) => Context;

// export type Registered<ExecutableType, Executable, OnErroParams, Context> = {
//   matcher: ExecutionMatcher<Executable>;
//   handler: ExecutionHandler<ExecutableType, Executable, OnErroParams, Context>;
// };

// /**
//  * Operator Creators
//  */

// type ExecutionOptions<ExecutableType, OnErroParams, Context> = {
//   onFrameEnd: (output: Context) => void;
//   onError: ErrorFunction<OnErroParams, ExecutableType>;
//   getOnErrorParams: (error: any) => OnErroParams;
//   unknownHandler: (
//     executable: any,
//     onError: ErrorFunction<OnErroParams, ExecutableType>,
//     exits: HandlerExits<ExecutableType, OnErroParams, Context>
//   ) => Context;
// };

// export function createExecution<ExecutableType, OnErroParams, Context>(
//   options: ExecutionOptions<ExecutableType, OnErroParams, Context>,
//   initialRegistered: Array<Registered<ExecutableType, any, OnErroParams, Context>> = []
// ) {
//   const { onError: defaultOnError, onFrameEnd, getOnErrorParams, unknownHandler } = options;

//   let registered: Array<Registered<ExecutableType, any, OnErroParams, Context>> = [...initialRegistered];
//   let handlerExits: HandlerExits<ExecutableType, OnErroParams, Context> = {
//     resolve,
//     resolveAsync,
//     reject,
//     rejectAsync,
//   };

//   function resolveAsync(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>): void {
//     const output = resolve(exec, onError);
//     onFrameEnd(output);
//   }

//   function rejectAsync(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any): void {
//     const errorResult = onError(getOnErrorParams(error));
//     const erroName = (onError as any).displayName || onError.name || 'onError';
//     resolveAsync(errorResult, err => {
//       throw err;
//     });
//   }

//   function reject(onError: ErrorFunction<OnErroParams, ExecutableType>, error: any): Context {
//     const errorResult = onError(getOnErrorParams(error));
//     const erroName = (onError as any).displayName || onError.name || 'onError';
//     return resolve(errorResult, err => {
//       throw err;
//     });
//   }

//   function resolve(exec: any, onError: ErrorFunction<OnErroParams, ExecutableType>): Context {
//     let customExecResult: Context = null as any;
//     const customExecUsed = registered.some(reg => {
//       if (reg.matcher(exec)) {
//         customExecResult = reg.handler(exec, onError, handlerExits);
//         return true;
//       }
//       return false;
//     });
//     if (customExecUsed) {
//       return customExecResult;
//     }

//     // Unknown
//     return unknownHandler(exec, onError, handlerExits);
//   }

//   function run(action: ExecutableType): void {
//     resolveAsync(action, defaultOnError);
//   }

//   function register<Exec>(reg: Registered<ExecutableType, Exec, OnErroParams, Context>): () => void {
//     registered = [...registered, reg];
//     const unregisterExecution = () => {
//       const index = registered.indexOf(reg);
//       if (index > -1) {
//         registered.splice(index, 1);
//       }
//     };
//     return unregisterExecution;
//   }

//   return {
//     run,
//     register,
//   };
// }
