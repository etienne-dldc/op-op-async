import {
  handleArray,
  handleNull,
  handlePromise,
  handleObject,
  handleString,
  executableArray,
} from './handlers/primitive';
import { pipe } from './handlers/utils';
import { handleAttempt, attempt } from './handlers/custom';
import { run, Context } from './overmind';

const handleAll = pipe(
  handleNull,
  handleString,
  handleArray,
  handlePromise,
  handleAttempt,
  handleObject
);

const initialContext: Context = {
  path: [],
  errorHandlers: [],
};

// run(
//   handleAll,
//   {
//     normal: ['hello'],
//     attempt: ,
//     yolo: [executableArray([null])],
//   },
//   initialContext
// );

run(handleAll, attempt('maybe', Promise.reject('hey'), err => 'circular ?'), initialContext);
