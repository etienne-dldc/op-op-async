import { createHandler, Context, Handler, Exits } from '../overmind';

export function pipe(...handlers: Array<Handler>): Handler {
  return createHandler((executable, context, exits) => {
    let ctx = context;
    const createExits = (nextOperatorIndex: number, exits: Exits, ctx: Context): Exits => {
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
