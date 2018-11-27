import { IHandler, createHandler as untypedCreateHandler, IExit, IExits } from './lib';

export type Path = Array<string | number>;

export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny = {
  [IS_EXECUTABLE]: true;
};

// type ExecutableNoCircular = null | ExecutableAny | ObjectOfExecutable;
type ExecutableNoCircular = null | string | ExecutableAny | ObjectOfExecutable;

export type Executable = ExecutableNoCircular | ArrayOfExecutable | Promise<ExecutableNoCircular>;

export type ArrayOfExecutable = Array<ExecutableNoCircular | Promise<ExecutableNoCircular>>;

export type ObjectOfExecutable = {
  [key: string]: Executable;
};

export function asExecutable<Input = never>(exec: Input): ExecutableAny {
  return exec as any;
}

export type ErrorHandler = (error: any) => Executable;

export type Context = {
  path: Path;
  errorHandlers: Array<ErrorHandler>;
};

export type Handler = IHandler<Context>;
export type Exit = IExit<Context>;
export type Exits = IExits<Context>;

export function createNextContext(
  ctx: Context,
  part: string | number | null = null,
  errorHandler?: ErrorHandler
): Context {
  const nextPath = part === null ? ctx.path : [...ctx.path, part];
  console.log(nextPath);
  if (part === null && !errorHandler) {
    return ctx;
  }
  return {
    ...ctx,
    errorHandlers: errorHandler ? [...ctx.errorHandlers, errorHandler] : ctx.errorHandlers,
    path: nextPath,
  };
}

export function handleError(exit: Exit, err: any, context: Context): Context {
  const onErrorCopy = [...context.errorHandlers];
  if (onErrorCopy.length === 0) {
    throw err;
  }
  const onError = onErrorCopy.pop();
  if (!onError) {
    throw err;
  }
  return exit(onError(err), {
    ...context,
    errorHandlers: onErrorCopy,
  });
}

export function run(handler: Handler, executable: Executable, inititlaContext: Context): Context {
  const handle: Exit = (exec, ctx) => {
    return handler(exec, ctx, {
      handle: handle,
      handleAsync: (exec, ctx) => {
        const asyncResult = handle(exec, ctx);
        console.log('async: ', asyncResult);
        return asyncResult;
      },
      ignore: (exec, ctx) => {
        throw new Error('Unsuported');
      },
    });
  };
  const result = handle(executable, inititlaContext);
  console.log('sync', result);
  return result;
}

export function createHandler(handler: IHandler<Context>): IHandler<Context> {
  return untypedCreateHandler(handler);
}
