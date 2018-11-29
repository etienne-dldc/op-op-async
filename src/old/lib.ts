export type IExit<Context> = (executable: any, context: Context) => Context;

export type IExits<Context> = {
  handle: IExit<Context>;
  handleAsync: IExit<Context>;
  ignore: IExit<Context>;
};

export type OppError = any;

export type IHandler<Context> = (executable: any, context: Context, exits: IExits<Context>) => Context;

export function createHandler<Context>(handler: IHandler<Context>): IHandler<Context> {
  return handler;
}
