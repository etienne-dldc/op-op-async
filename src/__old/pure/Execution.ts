export const yolo = true;

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
