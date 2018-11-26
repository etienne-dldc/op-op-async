export const yolo2 = true;

// import { typedOperators, App } from './Execution';

// type State = {
//   foo: string;
// };

// const { action, attempt, mutate, executable } = typedOperators<State>();

// function wait(ms: number) {
//   return new Promise((resolve, reject) => {
//     window.setTimeout(() => {
//       console.log('===');
//       resolve();
//     }, ms);
//   });
// }

// const myAction = action<number>(function myAction({ value }) {
//   if (value > 2) {
//     return mutate('setFooHey', state => (state.foo = 'hey'));
//   }
//   if (value === 4) {
//     return {
//       setYolo: mutate(state => (state.foo = 'bla')),
//       doAsyncStuff: wait(600).then(v => mutate(state => (state.foo = 'huhu'))),
//     };
//   }
//   return [
//     mutate(state => (state.foo = 'bla')),
//     mutate(state => (state.foo = 'bla')),
//     executable('last', [mutate(state => (state.foo = 'bla'))]),
//   ];
// });

// const effects = {
//   fetchStuff: (num: number) => wait(500).then(v => Promise.reject(new Error('Hehheh'))),
// };

// const handleStuffFetched = action<Array<number>>('handleStuffFetched', ({ value, state }) => {
//   // throw new Error('yolo');
//   if (state.foo === 'bar') {
//     return mutate(s => (s.foo = 'yolo'));
//   }
//   return null;
// });

// const doStuff = action('doStuff', () => ({
//   setStuff: wait(1000).then(v => mutate(s => (s.foo = 'hehe'))),
//   doNextStuff: {
//     fetch: effects.fetchStuff(3).then(res => handleStuffFetched(res)),
//   },
// }));

// const doStuffSafe = attempt('doStuffSafe', doStuff(), function customErrorHandler({ error }) {
//   console.log('custom error handler', error);
//   return null;
// });

// const initialState: State = {
//   foo: 'bar',
// };

// const app = new App({
//   state: initialState,
// });

// app.runAction(doStuffSafe);
// app.run(doStuffSafe);
// window.setTimeout(() => {
//   console.log('====');
// }, 0);
// window.setTimeout(() => {
//   console.log('====');
//   app.run(doStuff());
// }, 3000);

// window.setTimeout(() => {
//   console.log('====');
// }, 6000);

// app.run(myAction(1));
