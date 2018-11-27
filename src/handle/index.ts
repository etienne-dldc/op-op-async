import {
  handleArray,
  handleNull,
  handlePromise,
  handleObject,
  handleString,
  executableArray,
} from './handlers/primitive';
import { pipe } from './handlers/utils';
import { handleAttempt, attempt, handleAction, handleRunAction, action } from './handlers/custom';
import { run, Context } from './overmind';

const handleAll = pipe(
  handleNull,
  handleString,
  handleArray,
  handlePromise,
  handleAttempt,
  handleRunAction,
  handleAction,
  handleObject
);

const initialContext: Context = {
  path: [],
  errorHandlers: [],
};

const doStuff = action<number>('doStuff', num => {
  console.log('Hehe', num);
  return null;
});

// run(
//   handleAll,
//   {
//     normal: ['hello'],
//     attempt: ,
//     yolo: [executableArray([null])],
//   },
//   initialContext
// );

run(handleAll, Promise.resolve(doStuff(42)), initialContext);
