import { createHandler, Context, Handler, Exits } from '../base';

export function pipe(...handlers: Array<Handler<any>>): Handler<any> {
  return createHandler((executable, context, exits) => {
    let ctx = context;
    const createExits = (nextOperatorIndex: number, exits: Exits<any>, ctx: Context<any>): Exits<any> => {
      const nextHandler = handlers[nextOperatorIndex];
      return {
        handle: exits.handle,
        handleAsync: exits.handleAsync,
        ignore: (nextExec, nextCtx) => {
          if (nextHandler) {
            return nextHandler(nextExec, nextCtx, createExits(nextOperatorIndex + 1, exits, nextCtx));
          }
          return exits.ignore(nextExec, nextCtx);
        },
      };
    };
    return handlers[0](executable, ctx, createExits(1, exits, ctx));
  });
}
