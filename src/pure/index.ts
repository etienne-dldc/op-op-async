import { createExecution, asExecutable } from './Execution';

const execution = createExecution<{ error: any }, null>({
  createHandlerContext: ctx => ctx,
  getOnErrorParams: error => ({ error }),
  onError: ({ error }) => {
    console.log(error);
    return null;
  },
  onFrameEnd: () => {
    console.log('frame end');
  },
  basicHandlerOutputs: {
    null: () => null,
    promise: () => null,
    object: () => null,
    array: () => null,
    noMatch: () => null,
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
