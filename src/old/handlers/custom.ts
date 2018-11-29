import {
  Executable,
  asExecutable,
  ExecutableAny,
  createHandler,
  createNextContext,
  ErrorHandler,
  Context,
  handleError,
} from '../base';
import { isPlainObject } from '../../utils';

const IS_ATTEMPT = Symbol('IS_ATTEMPT');

type Attempt<Input, Output> = {
  [IS_ATTEMPT]: {
    displayName: string;
    attempt: Executable<Input, Output>;
    onError: ErrorHandler;
  };
};

function isAttempt(executable: any): executable is Attempt<any, any> {
  return isPlainObject(executable) && executable[IS_ATTEMPT];
}

export function attempt<Input, Output>(name: string, attempt: Executable<any, any>, onError: ErrorHandler) {
  return asExecutable<Input, Output, Attempt<Input, Output>>({
    [IS_ATTEMPT]: {
      displayName: name,
      attempt,
      onError,
    },
  });
}

export const handleAttempt = createHandler((executable, ctx, { handle, ignore }) => {
  if (isAttempt(executable)) {
    const result = handle(
      executable[IS_ATTEMPT].attempt,
      createNextContext(ctx, ctx.value, 'attempt', executable[IS_ATTEMPT].onError)
    );
    return result;
  }
  return ignore(executable, ctx);
});

/**
 * RunAction
 */

const IS_RUN_ACTION = Symbol('IS_RUN_ACTION');

type ActionFunction<Input, Output> = (value: Input, ctx: Context<Input>) => Executable<Input, Output>;

type RunAction<Input, Output> = {
  [IS_RUN_ACTION]: {
    action: ActionFunction<Input, Output>;
    displayName: string;
    value: Input;
  };
};

export function runAction<Input, Output>(
  name: string,
  action: ActionFunction<Input, Output>,
  value: Input
): ExecutableAny<Input, Output> {
  return asExecutable<Input, Output, RunAction<Input, Output>>({
    [IS_RUN_ACTION]: {
      action,
      displayName: name,
      value,
    },
  });
}

function isRunAction(executable: any): executable is RunAction<any, any> {
  return isPlainObject(executable) && executable[IS_RUN_ACTION];
}

export const handleRunAction = createHandler((executable, ctx, { ignore, handle }) => {
  if (isRunAction(executable)) {
    const actionCtx = createNextContext(ctx, ctx.value, executable[IS_RUN_ACTION].displayName);
    let nextExec: Executable;
    try {
      nextExec = executable[IS_RUN_ACTION].action(executable[IS_RUN_ACTION].value, actionCtx);
    } catch (error) {
      return handleError(handle, error, actionCtx);
    }
    return handle(nextExec, actionCtx);
  }
  return ignore(executable, ctx);
});

/**
 * Action
 */

const IS_ACTION = Symbol('IS_ACTION');

type Action<Value> = (Value extends void ? { (): RunAction<Value> } : { (input: Value): RunAction<Value> }) & {
  [IS_ACTION]: true;
};

function isAction(executable: any): executable is Action<any> {
  return executable && executable[IS_ACTION];
}

export function action<Value>(name: string, action: ActionFunction<Value>): Action<Value> {
  const result = ((value: Value) => runAction(name, action, value)) as any;
  result[IS_ACTION] = true;
  return result;
}

export const handleAction = createHandler((executable, ctx, { handle, ignore }) => {
  if (isAction(executable)) {
    return handleError(handle, new Error('Action are not executable'), ctx);
  }
  return ignore(executable, ctx);
});
