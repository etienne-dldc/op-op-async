import { pipe, map, value, action, mutation } from './factories';
import { run } from './lib';

const logNumber = action<number, number>(ctx => {
  console.log(ctx.value);
  return value(ctx.value);
});

const setBar = mutation<number>(({ state, value }) => {
  state.bar = value;
});

const doStuff = pipe(
  // value(42),
  map<number, Promise<string>>(({ value }) => Promise.resolve(`${value + 4}`)),
  value(43),
  setBar,
  action(ctx => {
    return value({ stuff: true });
  }),
  map(({ value }) => {
    return value.stuff;
  }),
  value(43),
  logNumber,
  map(ctx => ctx.value),
  map(ctx => ctx.value)
);

run(doStuff(42));
