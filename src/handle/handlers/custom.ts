import { Executable, asExecutable, ExecutableAny, createHandler, createNextContext, ErrorHandler } from '../overmind';
import { isPlainObject } from '../utils';

const IS_ATTEMPT = Symbol('IS_ATTEMPT');

type Attempt = {
  [IS_ATTEMPT]: true;
  displayName: string;
  attempt: Executable;
  onError: ErrorHandler;
};

function isAttempt(executable: any): executable is Attempt {
  return isPlainObject(executable) && executable[IS_ATTEMPT];
}

export function attempt(name: string, attempt: Executable, onError: ErrorHandler) {
  return asExecutable<Attempt>({
    [IS_ATTEMPT]: true,
    displayName: name,
    attempt,
    onError,
  });
}

export const handleAttempt = createHandler((executable, ctx, { handle, ignore }) => {
  if (isAttempt(executable)) {
    const result = handle(executable.attempt, createNextContext(ctx, 'attempt', executable.onError));
    return result;
  }
  return ignore(executable, ctx);
});
