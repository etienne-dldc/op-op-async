import { Operator, toPromise, map, filter, toFunc, flattenPromiseValue, pipe, execute, mapAsync } from './op-op';
import { string } from 'prop-types';

// function wait(time: number): Promise<void> {
//   return new Promise(resolve => {
//     window.setTimeout(() => {
//       resolve();
//     }, time);
//   });
// }

// const upperCase = map<string, string>(value => value.toUpperCase());

// const longerThan = (length: number) =>
//   filter<string>(value => value.length > length);

// const test: Operator<string, string> = pipe(
//   longerThan(3),
//   upperCase
// );

// const run = toPromise(test);

// run("foo").then(console.log);
// run("foobar").then(console.log);

// const mapStuffLatter = map<string, Promise<string>>(val => wait(1000).then(() => val));
// mapStuffLatter(null, 'mapStuffLatter', console.log);

// const mapStuffNow = map<string, string>(val => val + ' now');

// mapStuffNow(null, 'mapStuffNow', console.log);
// console.log('after mapStuffNow');

// const mapStuffAlmost = map<string, Promise<string>>(val => Promise.resolve(val + ' now'));

// mapStuffAlmost(null, 'mapStuffAlmost', console.log);
// console.log('after mapStuffAlmost');

// const mapToError = map<string, Promise<string>>(val => {
//   console.log('run mapToError');
//   return Promise.reject('an error');
// });

// mapToError(null, 'mapToError', console.log);
// mapToError('error from before', 'mapToError', console.log);

// const doStuff = pipe(
//   map<string, Promise<string>>(val => wait(1000).then(() => val + ' 1')),
//   map<string, Promise<string>>(val => wait(1000).then(() => val + ' 2')),
//   map<string, Promise<string>>(val => wait(1000).then(() => val + ' 3'))
// );

// doStuff(null, 'doStuff', console.log);

// function imediatOrPromise<Val>(
//   returnPromOrValue: (next: (val: any) => any) => Val
// ): Val extends Promise<infer U> ? U : Val {
//   let executed = false;
//   let result = null;
//   const prom = new Promise((resolve, reject) => {
//     returnPromOrValue(val => {
//       executed = true;
//       result = val;
//       resolve(val);
//     });
//   });
//   return (executed ? result : prom) as any;
// }

// console.log(
//   imediatOrPromise(next => {
//     next(42);
//   })
// );

// console.log(
//   imediatOrPromise(next => {
//     Promise.resolve().then(() => next(42));
//   })
// );

// console.log(
//   imediatOrPromise(next => {
//     window.setTimeout(() => {
//       next(42);
//     }, 1000);
//   })
// );

// function throwStuff() {
//   return new Error('Yolo');
// }

// console.log('before');
// console.log(
//   Promise.resolve(throwStuff()).then(v => {
//     console.log('value', v);
//   })
// );
// console.log('after');

const result1 = execute(map<string, string>(v => v + '!'))('test');
const result2 = execute(map<string, Promise<string>>(v => Promise.resolve(v + '!')))('test');

const result3 = execute(mapAsync<string, Promise<string>>(v => Promise.resolve(v + '!')))('test');

const result4 = execute(
  pipe(
    map<string, string>(v => v + '!'),
    map<string, string>(v => v + '!')
  )
)('test3');

const result5 = execute(
  pipe(
    map<string, string>(v => v + '!'),
    map<string, Promise<string>>(v => Promise.resolve(v + '!')),
    map<string, string>(v => v + '!')
  )
)('test3');

console.log({
  result1,
  result2,
  result3,
  result4,
  result5,
});
