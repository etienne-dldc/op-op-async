export const yolo3 = true;

// import { ProxyStateTree } from 'proxy-state-tree';
// import { isPlainObject, isPromise, appToPath } from './utils';
// import { ErrorFunction, ExecutableAny, Executable, BaseContext, ValueContext, ErrorContext } from './types';

// type BaseConfig = {
//   state?: {};
// };

// type NeedFlush = boolean;

// type TheState<Config extends BaseConfig> = Config['state'] extends undefined ? {} : Config['state'];

// /**
//  * Execution Handlers
//  */

// type RegisterContext<State> = {
//   resolve(exec: any, path: Array<string>, onError: ErrorFunction<State>): NeedFlush;
//   resolveAsync(exec: any, path: Array<string>, onError: ErrorFunction<State>): void;
//   reject(onError: ErrorFunction<State>, error: any, path: Array<string>): NeedFlush;
//   rejectAsync(onError: ErrorFunction<State>, error: any, path: Array<string>): void;
//   getState(): State;
//   tree: ProxyStateTree;
// };
// type ExecutionMatcher<Exec> = (exec: any) => exec is Exec;
// type ExecutionHandler<State, Exec> = (exec: Exec, ctx: RegisterContext<State>) => NeedFlush;

// type RegisteredExecution<State, Exec> = {
//   matcher: ExecutionMatcher<Exec>;
//   handler: ExecutionHandler<State, Exec>;
// };

// /**
//  * Operator Creators
//  */

// export function asExecutable(exec: any): ExecutableAny {
//   return exec as any;
// }

// const DEFAULT_ON_ERROR: ErrorFunction<any> = ({ error }) => {
//   console.log('got error');
//   console.log(error);
//   return null;
// };

// export class App<Config extends BaseConfig> {
//   private tree: ProxyStateTree;
//   private registeredExecution: Array<RegisteredExecution<TheState<Config>, any>> = [];
//   private registerContext: null | RegisterContext<TheState<Config>> = null;

//   constructor(config: Config) {
//     this.tree = new ProxyStateTree(config.state || {});
//   }

//   getState(): TheState<Config> {
//     return this.tree.get();
//   }

//   run(action: Executable<TheState<Config>>): void {
//     this.resolveAsync(action, [], DEFAULT_ON_ERROR);
//   }

//   registerExecution<Exec>(reg: RegisteredExecution<TheState<Config>, Exec>): () => void {
//     this.registeredExecution.push(reg);
//     const unregisterExecution = () => {
//       const index = this.registeredExecution.indexOf(reg);
//       if (index > -1) {
//         this.registeredExecution.splice(index, 1);
//       }
//     };
//     return unregisterExecution;
//   }

//   private resolveAsync(exec: any, path: Array<string>, onError: ErrorFunction<TheState<Config>>): void {
//     const needFlush = this.resolve(exec, path, onError);
//     console.log('flush ?', needFlush);
//     if (needFlush) {
//       this.tree.flush();
//     }
//   }

//   private rejectAsync(onError: ErrorFunction<TheState<Config>>, error: any, path: Array<string>): void {
//     const errorResult = onError(this.getErrorContext(error));
//     const erroName = (onError as any).displayName || onError.name || 'onError';
//     this.resolveAsync(errorResult, [...path, erroName], DEFAULT_ON_ERROR);
//   }

//   private reject(onError: ErrorFunction<TheState<Config>>, error: any, path: Array<string>): NeedFlush {
//     const errorResult = onError(this.getErrorContext(error));
//     const erroName = (onError as any).displayName || onError.name || 'onError';
//     return this.resolve(errorResult, [...path, erroName], DEFAULT_ON_ERROR);
//   }

//   private resolve(exec: any, path: Array<string>, onError: ErrorFunction<TheState<Config>>): NeedFlush {
//     console.log(path);

//     if (exec === null) {
//       console.log('null');
//       return false;
//     }
//     if (isPromise(exec)) {
//       console.log('promise');
//       exec
//         .then(subResult => this.resolveAsync(subResult, [...path, 'resolved'], onError))
//         .catch(error => {
//           this.rejectAsync(onError, error, [...path, 'rejected']);
//         });
//       return false;
//     }
//     if (Array.isArray(exec)) {
//       const everyFlush = exec.map((item, index) => {
//         return this.resolve(item, appToPath(path, String(index)), onError);
//       });
//       return everyFlush.some(v => v === true);
//     }

//     let customExecResult = false;
//     const customExecUsed = this.registeredExecution.some(reg => {
//       if (reg.matcher(exec)) {
//         customExecResult = reg.handler(exec, this.registerContext);
//         return true;
//       }
//       return false;
//     });
//     if (customExecUsed) {
//       return customExecResult;
//     }

//     if (isPlainObject(exec)) {
//       console.log('plain object');
//       const everyFlush = Object.keys(exec).map(key => {
//         return this.resolve(exec[key], appToPath(path, key), onError);
//       });
//       return everyFlush.some(v => v === true);
//     }

//     console.log('unknon');
//     console.log(exec);
//     return false;
//   }

//   private getBaseContext(): BaseContext<TheState<Config>> {
//     return {
//       state: this.getState(),
//     };
//   }

//   private getValueContext<Value>(value: Value | undefined): ValueContext<TheState<Config>, Value> {
//     return {
//       ...this.getBaseContext(),
//       value: value as any,
//     };
//   }

//   private getErrorContext(error: any): ErrorContext<TheState<Config>> {
//     return {
//       ...this.getBaseContext(),
//       error,
//     };
//   }
// }
