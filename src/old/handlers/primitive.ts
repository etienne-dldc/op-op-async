import { isPromise, isPlainObject } from '../../utils';
import {
  createHandler,
  createNextContext,
  Context,
  Executable,
  ArrayOfExecutable,
  ExecutableAny,
  ObjectOfExecutable,
  handleError,
} from '../base';

export const handleNull = createHandler((executable, ctx, { ignore }) => {
  if (executable === null) {
    return createNextContext(ctx, null, 'null');
  }
  return ignore(executable, ctx);
});

export const handleString = createHandler((executable, ctx, { ignore }) => {
  if (typeof executable === 'string') {
    return createNextContext(ctx, executable, `string:${executable}`);
  }
  return ignore(executable, ctx);
});

export const handlePromise = createHandler((executable, ctx, { handleAsync, ignore }) => {
  if (isPromise(executable)) {
    const promiseCtx = createNextContext(ctx, ctx.value, 'promise');
    executable
      .then(val => handleAsync(val, createNextContext(promiseCtx, val, 'resolved')))
      .catch(err => handleError(handleAsync, err, createNextContext(promiseCtx, err, 'rejected')));
    return promiseCtx;
  }
  return ignore(executable, ctx);
});

export const handleArray = createHandler((executable, ctx, { handle, ignore }) => {
  if (Array.isArray(executable)) {
    const arrContext = createNextContext(ctx, ctx.value, 'array');
    const contexts = executable.map((exec, index) => handle(exec, createNextContext(arrContext, ctx.value, index)));
    return arrContext;
  }
  return ignore(executable, ctx);
});

export function executableArray<Input, Output>(exec: ArrayOfExecutable<Input, Output>): ExecutableAny<Input, Output> {
  return exec as any;
}

export const handleObject = createHandler((executable, ctx, { handle, ignore }) => {
  if (isPlainObject(executable)) {
    const objContext = createNextContext(ctx, ctx.value, 'object');
    const contexts: { [key: string]: Context<any> } = Object.keys(executable).reduce(
      (acc, key) => {
        acc[key] = handle(executable[key], createNextContext(objContext, ctx.value, key));
        return acc;
      },
      {} as any
    );
    return objContext;
  }
  return ignore(executable, ctx);
});

export function executableObject<Input, Output>(exec: ObjectOfExecutable<Input, Output>): ExecutableAny<Input, Output> {
  return exec as any;
}
