import './Execution';

// const execution = createExecution<any, { error: any }, null>(
//   {
//     getOnErrorParams: error => ({ error }),
//     onError: ({ error }) => {
//       console.log(error);
//       return {
//         leYolo: ['oops'],
//       };
//     },
//     onFrameEnd: () => {
//       console.log('frame end');
//     },
//     unknownHandler: (executable, onError, ctx) => {
//       return ctx.reject(onError, new Error('Unsupported type ' + typeof executable));
//     },
//   },
//   [supportNull(() => null), supportArray(() => null), supportPomise(() => null), supportObject(() => null)]
// );

// try {
//   execution.run([
//     [],
//     'hello',
//     () => {},
//     {
//       demo: {
//         yolo: [],
//       },
//     },
//   ]);
// } catch (error) {
//   console.log('Error in onError');
//   console.log(error);
// }

// console.log('=====');

// execution.register<string>({
//   matcher: (val): val is string => typeof val === 'string',
//   handler: (val, onError, ctx) => {
//     console.log('string', val);
//     return null;
//   },
// });

// execution.run([
//   [],
//   'hello',
//   () => {},
//   {
//     demo: {
//       yolo: [],
//     },
//   },
// ]);
