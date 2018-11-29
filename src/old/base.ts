import { IHandler, createHandler as untypedCreateHandler, IExit, IExits } from './lib';

export type Path = Array<string | number>;

export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny<Input, Output> = {
  [IS_EXECUTABLE]: {
    __input: Input;
    __output: Output;
  };
};

// type ExecutableNoCircular = null | ExecutableAny | ObjectOfExecutable;
type ExecutableNoCircular<Input, Output> =
  | null
  | string
  | ExecutableAny<Input, Output>
  | ObjectOfExecutable<Input, Output>;

export type Executable<Input, Output> =
  | ExecutableNoCircular<Input, Output>
  | ArrayOfExecutable<Input, Output>
  | Promise<ExecutableNoCircular<Input, Output>>;

export type ArrayOfExecutable<Input, Output> = Array<
  ExecutableNoCircular<Input, Output> | Promise<ExecutableNoCircular<Input, Output>>
>;

export type ObjectOfExecutable<Input, Output> = {
  [key: string]: Executable<Input, Output>;
};

export function asExecutable<Input, Output, T = never>(exec: T): ExecutableAny<Input, Output> {
  return exec as any;
}

export type ErrorHandler = (error: any) => Executable<any, any>;

export type Context<Value> = {
  value: Value;
  path: Path;
  errorHandlers: Array<ErrorHandler>;
};

export type Handler<Value> = IHandler<Context<Value>>;
export type Exit<Value> = IExit<Context<Value>>;
export type Exits<Value> = IExits<Context<Value>>;

export function createNextContext<Input, Output>(
  ctx: Context<Input>,
  value: Output,
  part: string | number | null,
  errorHandler?: ErrorHandler
): Context<Output> {
  const nextPath = part === null ? ctx.path : [...ctx.path, part];
  console.log(nextPath);
  return {
    ...ctx,
    errorHandlers: errorHandler ? [...ctx.errorHandlers, errorHandler] : ctx.errorHandlers,
    path: nextPath,
    value,
  };
}

export function handleError<Value>(exit: Exit<Value>, err: any, context: Context<Value>): Context<Value> {
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

export function run<Input, Output>(
  handler: Handler<Input>,
  executable: Executable<Input, Output>,
  inititlaContext: Context<Input>
): Context<Output> {
  const handle: Exit<any> = (exec, ctx) => {
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

export function createHandler(handler: IHandler<Context<any>>): IHandler<Context<any>> {
  return untypedCreateHandler(handler);
}
