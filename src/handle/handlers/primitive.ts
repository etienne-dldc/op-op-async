import { isPromise, isPlainObject } from '../utils';
import {
  createHandler,
  createNextContext,
  Context,
  Executable,
  ArrayOfExecutable,
  ExecutableAny,
  ObjectOfExecutable,
  handleError,
} from '../overmind';

export const handleNull = createHandler((executable, ctx, { ignore }) => {
  if (executable === null) {
    return createNextContext(ctx, 'null');
  }
  return ignore(executable, ctx);
});

export const handleString = createHandler((executable, ctx, { ignore }) => {
  if (typeof executable === 'string') {
    return createNextContext(ctx, `string:${executable}`);
  }
  return ignore(executable, ctx);
});

export const handlePromise = createHandler((executable, ctx, { handleAsync, ignore }) => {
  if (isPromise(executable)) {
    const promiseCtx = createNextContext(ctx, 'promise');
    executable
      .then(val => handleAsync(val, createNextContext(promiseCtx, 'resolved')))
      .catch(err => handleError(handleAsync, err, createNextContext(promiseCtx, 'rejected')));
    return promiseCtx;
  }
  return ignore(executable, ctx);
});

export const handleArray = createHandler((executable, ctx, { handle, ignore }) => {
  if (Array.isArray(executable)) {
    const arrContext = createNextContext(ctx, 'array');
    const contexts = executable.map((exec, index) => handle(exec, createNextContext(arrContext, index)));
    return arrContext;
  }
  return ignore(executable, ctx);
});

export function executableArray(exec: ArrayOfExecutable): ExecutableAny {
  return exec as any;
}

export const handleObject = createHandler((executable, ctx, { handle, ignore }) => {
  if (isPlainObject(executable)) {
    const objContext = createNextContext(ctx, 'object');
    const contexts: { [key: string]: Context } = Object.keys(executable).reduce(
      (acc, key) => {
        acc[key] = handle(executable[key], createNextContext(objContext, key));
        return acc;
      },
      {} as any
    );
    return objContext;
  }
  return ignore(executable, ctx);
});

export function executableObject(exec: ObjectOfExecutable): ExecutableAny {
  return exec as any;
}
