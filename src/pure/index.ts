import { createExecution, asExecutable } from './Execution';

const execution = createExecution<{ error: any }, null>({
  createHandlerContext: ctx => ctx,
  getOnErrorParams: error => ({ error }),
  onError: ({ error }) => {
    console.log(error);
    return {
      leYolo: [asExecutable('oops')],
    };
  },
  onFrameEnd: () => {
    console.log('frame end');
  },
  basicHandlerOutputs: {
    null: () => null,
    promise: () => null,
    object: () => null,
    array: () => null,
    unknown: () => null,
  },
  basicHandlerHooks: {
    unknown: (exec, next, path, onError, isInError, ctx) => {
      return ctx.reject(onError, new Error('Unsupported'), path, isInError);
    },
  },
});

execution.run([
  asExecutable([]),
  asExecutable('hello'),
  {
    demo: {
      yolo: [],
    },
  },
]);
