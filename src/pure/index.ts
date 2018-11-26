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

try {
  execution.run([
    asExecutable([]),
    asExecutable('hello'),
    asExecutable(() => {}),
    {
      demo: {
        yolo: [],
      },
    },
  ]);
} catch (error) {
  console.log(error);
}

console.log('=====');

execution.register<string>({
  matcher: (val): val is string => typeof val === 'string',
  handler: (val, path, onError, isInError, ctx) => {
    console.log('string', val);
    return null;
  },
});

execution.run([
  asExecutable([]),
  asExecutable('hello'),
  asExecutable(() => {}),
  {
    demo: {
      yolo: [],
    },
  },
]);
