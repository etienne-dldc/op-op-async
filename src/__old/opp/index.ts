import { transform, makeExecutable, pipe, filter } from './lib';

const addTwo = transform((v: number) => v + 2);
const double = transform((v: number) => Promise.resolve(v * 2));
const filterMoreThanTwenty = filter((v: number) => Promise.resolve(v > 20));
const universe = transform((v: any) => {
  return 42;
});

const myDemoAction = makeExecutable(
  pipe(
    addTwo,
    double,
    double,
    filterMoreThanTwenty,
    universe
  ),
  'myDemoAction'
);

const myOtherAction = makeExecutable(
  pipe(
    addTwo,
    double
  ),
  'myOtherAction'
);

const myThridAction = makeExecutable(
  pipe(
    addTwo,
    universe
  ),
  'myOtherAction'
);

Promise.resolve(myDemoAction(1)).then(console.log);
Promise.resolve(myDemoAction(2)).then(console.log);
Promise.resolve(myOtherAction(3)).then(console.log);
Promise.resolve(myDemoAction(4)).then(console.log);
Promise.resolve(myDemoAction(6)).then(console.log);
Promise.resolve(myOtherAction(2)).then(console.log);
Promise.resolve(myOtherAction(6)).then(console.log);
Promise.resolve(myThridAction(6)).then(console.log);
