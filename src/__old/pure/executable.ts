export const yolo = true;

// import { Registered, HandlerExits, ErrorFunction } from './Execution';
// import { isPromise, isPlainObject } from './utils';

// export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

// export type ExecutableAny = {
//   [IS_EXECUTABLE]: true;
// };

// type ExecutableNoCircular = null | ExecutableAny | ObjectOfExecutable;

// export type Executable = ExecutableNoCircular | ArrayOfExecutable | Promise<ExecutableNoCircular>;

// type ArrayOfExecutable = Array<ExecutableNoCircular | Promise<ExecutableNoCircular>>;

// type ObjectOfExecutable = {
//   [key: string]: Executable;
// };

// type Path = Array<string | number>;

// export function supportNull<ExecutableType, OnErroParams, HandlerOutput>(
//   output: (exec: null, exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>) => HandlerOutput,
//   hook?: (
//     exec: null,
//     next: (transformed: any) => HandlerOutput,
//     onError: ErrorFunction<OnErroParams, ExecutableType>,
//     exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
//   ) => HandlerOutput
// ): Registered<ExecutableType, null, OnErroParams, HandlerOutput> {
//   return {
//     matcher: (exec): exec is null => exec === null,
//     handler: (exec, onError, exits) => {
//       const next = () => output(null, exits);
//       return hook ? hook(null, next, onError, exits) : next();
//     },
//   };
// }

// export function supportPomise<ExecutableType, OnErroParams, HandlerOutput>(
//   output: (exec: Promise<any>, exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>) => HandlerOutput,
//   hook?: (
//     exec: Promise<any>,
//     next: (transformed: any) => HandlerOutput,
//     onError: ErrorFunction<OnErroParams, ExecutableType>,
//     exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
//   ) => HandlerOutput
// ): Registered<ExecutableType, Promise<any>, OnErroParams, HandlerOutput> {
//   return {
//     matcher: (exec): exec is Promise<any> => isPromise(exec),
//     handler: (exec, onError, exits) => {
//       const next = (transformed: Promise<any>) =>
//         output(
//           transformed
//             .then(subResult => exits.resolveAsync(subResult, onError))
//             .catch(error => {
//               exits.rejectAsync(onError, error);
//             }),
//           exits
//         );
//       return hook ? hook(exec, next, onError, exits) : next(exec);
//     },
//   };
// }

// export function supportArray<ExecutableType, OnErroParams, HandlerOutput>(
//   output: (exec: Array<any>, exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>) => HandlerOutput,
//   hook?: (
//     exec: Array<any>,
//     next: (transformed: any) => HandlerOutput,
//     onError: ErrorFunction<OnErroParams, ExecutableType>,
//     exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
//   ) => HandlerOutput
// ): Registered<ExecutableType, Array<any>, OnErroParams, HandlerOutput> {
//   return {
//     matcher: (exec): exec is Array<any> => Array.isArray(exec),
//     handler: (exec, onError, exits) => {
//       const next = (transformed: Array<any>) =>
//         output(
//           transformed.map(item => {
//             return exits.resolve(item, onError);
//           }),
//           exits
//         );
//       return hook ? hook(exec, next, onError, exits) : next(exec);
//     },
//   };
// }

// type PlainObject = { [key: string]: any };
// export function supportObject<ExecutableType, OnErroParams, HandlerOutput>(
//   output: (exec: PlainObject, exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>) => HandlerOutput,
//   hook?: (
//     exec: PlainObject,
//     next: (transformed: any) => HandlerOutput,
//     onError: ErrorFunction<OnErroParams, ExecutableType>,
//     exits: HandlerExits<ExecutableType, OnErroParams, HandlerOutput>
//   ) => HandlerOutput
// ): Registered<ExecutableType, PlainObject, OnErroParams, HandlerOutput> {
//   return {
//     matcher: (exec): exec is PlainObject => isPlainObject(exec),
//     handler: (exec, onError, exits) => {
//       const next = (transformed: PlainObject) =>
//         output(
//           Object.keys(transformed).reduce(
//             (acc, key) => {
//               acc[key] = exits.resolve(transformed[key], onError);
//               return acc;
//             },
//             {} as any
//           ),
//           exits
//         );
//       return hook ? hook(exec, next, onError, exits) : next(exec);
//     },
//   };
// }

// export function asExecutable(exec: any): ExecutableAny {
//   return exec as any;
// }
