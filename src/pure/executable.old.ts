const IS_ACTION = Symbol('IS_ACTION');
const IS_MUTATION = Symbol('IS_MUTATION');
const IS_RUN_ACTION = Symbol('IS_RUN_ACTION');
const IS_ERROR_HANDLER = Symbol('IS_ERROR_HANDLER');

type ActionFunction<State, Input> = (ctx: ValueContext<State, Input>) => ExecutableOutput<State>;

type NamedExecutable<State> = {
  [IS_EXECUTABLE]: true;
  exec: ExecutableParam<State>;
  displayName: string | null;
};

/**
 * OPERATORS
 */

type Mutation<State> = {
  [IS_MUTATION]: true;
  mutation: (state: State) => any;
  displayName: string | null;
};

type ErrorHandler<State> = {
  [IS_ERROR_HANDLER]: true;
  onError: ErrorFunction<State>;
  displayName: string | null;
  exec: Executable<State> | ArrayOfExecutable<State> | Promise<Executable<State>>;
};

type Action<State, Input> = (Input extends void
  ? { (): RunAction<State, void> }
  : { (input: Input): RunAction<State, Input> }) & {
  [IS_ACTION]: true;
  displayName: string | null;
  action: ActionFunction<State, Input>;
};

type RunAction<State, Value> = {
  [IS_RUN_ACTION]: true;
  action: ActionFunction<State, Value>;
  displayName: string | null;
  value: Value;
};

function attempt<State>(
  name: string | null,
  exec: ExecutableOutput<State>,
  onError: ErrorFunction<State>
): ErrorHandler<State> {
  return {
    [IS_ERROR_HANDLER]: true,
    onError,
    displayName: extractName(name, action),
    exec,
  };
}

function extractName(name: string | null, target: any): string | null {
  return name || target.displayName || target.name || null;
}

function createRunAction<State, Input>(
  action: ActionFunction<State, Input>,
  value: Input,
  name: string | null
): RunAction<State, Input> {
  return {
    [IS_RUN_ACTION]: true,
    action,
    displayName: extractName(name, action),
    value,
  };
}

export function action<State, Input = void>(
  name: string | null,
  action: ActionFunction<State, Input>
): Action<State, Input> {
  const result: Action<State, Input> = ((val: Input) => {
    // @ts-ignore
    return createRunAction(action, val, name);
  }) as any;
  result[IS_ACTION] = true;
  result.displayName = extractName(name, action);
  result.action = action;
  return result;
}

function mutate<State>(name: string | null, mutation: (state: State) => void): Mutation<State> {
  return {
    [IS_MUTATION]: true,
    mutation,
    displayName: extractName(name, mutation),
  };
}

function executable<State>(name: string | null, exec: ExecutableParam<State>): NamedExecutable<State> {
  return {
    [IS_EXECUTABLE]: true,
    exec,
    displayName: extractName(name, exec),
  };
}

function isMutation(obj: any): obj is Mutation<TheState<Config>> {
  return isPlainObject(obj) && obj[IS_MUTATION] === true;
}

function isExecutable(obj: any): obj is NamedExecutable<TheState<Config>> {
  return isPlainObject(obj) && obj[IS_EXECUTABLE] === true;
}

function isRunAction(obj: any): obj is RunAction<TheState<Config>, any> {
  return isPlainObject(obj) && obj[IS_RUN_ACTION] === true;
}

function isErroHandler(obj: any): obj is ErrorHandler<TheState<Config>> {
  return isPlainObject(obj) && obj[IS_ERROR_HANDLER] === true;
}

type TypedOperators<State> = {
  action<Input = void>(action: ActionFunction<State, Input>): Action<State, Input>;
  action<Input = void>(name: string, action: ActionFunction<State, Input>): Action<State, Input>;
  attempt(exec: ExecutableOutput<State>, onError: ErrorFunction<State>): ErrorHandler<State>;
  attempt(name: string, exec: ExecutableOutput<State>, onError: ErrorFunction<State>): ErrorHandler<State>;
  mutate(mutation: (state: State) => void): Mutation<State>;
  mutate(name: string, mutation: (state: State) => void): Mutation<State>;
  executable(exe: ExecutableParam<State>): NamedExecutable<State>;
  executable(name: string, exe: ExecutableParam<State>): NamedExecutable<State>;
};

function withOptionalName(fun: any): any {
  return (name: any, ...args: any[]) => {
    if (typeof name === 'string') {
      return fun(name, ...args);
    }
    return fun(null, name, ...args);
  };
}

export function typedOperators<State>(): TypedOperators<State> {
  return {
    action: withOptionalName(action),
    attempt: withOptionalName(attempt),
    mutate: withOptionalName(mutate),
    executable: withOptionalName(executable),
  };
}

// if (this.isExecutable(exec)) {
//   return this.resolve(exec.exec, appToPath(path, exec.displayName), onError);
// }
// if (this.isMutation(exec)) {
//   console.log('mutation at', appToPath(path, exec.displayName));
//   try {
//     this.tree.startMutationTracking();
//     exec.mutation(this.getState());
//     const mutations = this.tree.clearMutationTracking();
//     console.log(mutations);
//     return mutations.length > 0;
//   } catch (error) {
//     return this.reject(onError, error, appToPath(path, exec.displayName));
//   }
// }
// if (this.isErroHandler(exec)) {
//   console.log('error handler');
//   this.resolve(exec.exec, appToPath(path, exec.displayName), exec.onError);
//   return false;
// }
// if (this.isRunAction(exec)) {
//   console.log('runAction');
//   try {
//     const nextExec = exec.action(this.getValueContext(exec.value));
//     return this.resolve(nextExec, appToPath(path, exec.displayName), onError);
//   } catch (error) {
//     return this.reject(onError, error, [...path]);
//   }
// }

// private getBaseContext(): BaseContext<TheState<Config>> {
//   return {
//     state: this.getState(),
//   };
// }

// private getValueContext<Value>(value: Value | undefined): ValueContext<TheState<Config>, Value> {
//   return {
//     ...this.getBaseContext(),
//     value: value as any,
//   };
// }

// private getErrorContext(error: any): ErrorContext<TheState<Config>> {
//   return {
//     ...this.getBaseContext(),
//     error,
//   };
// }
