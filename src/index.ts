import { pipe, map, value, action, mutation, parallel, run } from './factories';
import { execute } from './lib';
import { Callable } from './types';

const setBar = mutation<number>(({ state, value }) => {
  state.bar = value;
});

const logNumber = action<number, number>(ctx => {
  console.log(ctx.value);
  return pipe(
    value(ctx.value),
    setBar
  );
});

const single = pipe(value(42));

single();

const double = map<number, number>(({ value }) => value * 2);

const eight = double(4);

const singleMap = pipe(map<number, number>(({ value }) => value * 2));

singleMap(34);

const doStuff = pipe(
  eight,
  value(42),
  map<number, Promise<string>>(({ value }) => Promise.resolve(`${value + 4}`)),
  value(43),
  setBar,
  action(() => {
    return value({ stuff: true });
  }),
  map(({ value }) => {
    return value.stuff;
  }),
  value(43),
  logNumber,
  pipe(
    map(ctx => ctx.value),
    map(ctx => ctx.value),
    map(ctx => ctx.value),
    map(ctx => ctx.value),
    map(ctx => ctx.value)
  )
);

execute(doStuff);

const para = parallel(
  value('hello'),
  map<{ num: number }, Promise<number>>(({ value }) => Promise.resolve(value.num * 2)),
  map<{ str: string }, number>(({ value }) => parseInt(value.str, 10))
);

para({ num: 34, str: '10' });

const logParaResult = pipe(
  para,
  run(({ value }) => {
    const str = value[0];
    const num = value[1];
    const otherNum = value[2];
    // value[3] // => error Index '3' is out-of-bounds in tuple of length 3
    console.log(value);
  })
);

// execute(logParaResult) // Error invalid input
execute(logParaResult({ str: '10', num: 34 }));
