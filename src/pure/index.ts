import { createExecution } from './Execution';

const execution = createExecution<any, { error: any }, null>({
  createHandlerContext: ctx => ctx,
  getOnErrorParams: error => ({ error }),
  onError: ({ error }) => {
    console.log(error);
    return {
      leYolo: ['oops'],
    };
  },
  onFrameEnd: () => {
    console.log('frame end');
  },
  unknownHandlerOutput: () => null,
  unknownHandlerHook: (exec, next, onError, isInError, ctx) => {
    return ctx.reject(onError, new Error('Unsupported'), isInError);
  },
});

try {
  execution.run([
    [],
    'hello',
    () => {},
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
  handler: (val, onError, isInError, ctx) => {
    console.log('string', val);
    return null;
  },
});

execution.run([
  [],
  'hello',
  () => {},
  {
    demo: {
      yolo: [],
    },
  },
]);
