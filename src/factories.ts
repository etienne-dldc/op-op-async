import { Executable, Context } from './types';

export type CombineAsync<Vals extends Array<boolean>> = Vals extends Array<false> ? false : true;

export function value<Output>(
  value: Output
): Output extends Promise<infer U> ? Executable<any, U, true> : Executable<any, Output, false> {
  return {} as any;
}

export function map<Input, Output>(
  mapper: (ctx: Context<Input>) => Output
): Output extends Promise<infer U> ? Executable<Input, U, true> : Executable<Input, Output, false> {
  return {} as any;
}

type Callable<Input, Output, Async extends boolean> = Executable<Input, Output, Async> &
  (Input extends void ? { (): Executable<any, Output, Async> } : { (input: Input): Executable<any, Output, Async> });

export function action<Input, Output>(
  act: (ctx: Context<Input>) => Executable<Input, Output, any>
): Output extends Promise<infer U> ? Callable<Input, U, true> : Callable<Input, Output, false> {
  return {} as any;
}

export function mutation<Input>(act: (ctx: Context<Input>) => void): Callable<Input, Input, false> {
  return {} as any;
}

/**
var range = num => Array(num).fill(null).map((v, i) => i);
range(10).map(i => [
  `// prettier-ignore\n`,
  `export function pipe<Input, ${range(i + 1).map(v => v+1).map(j => `O${j}, A${j} extends boolean`).join(', ')}>`,
  `(${range(i + 1).map(v => v+1).map(j => `exec${j}: Executable<${j === 1 ? 'Input' : `O${j - 1}`}, O${j}, A${j}>`).join(', ')}): `,
  `Callable<Input, O${i + 1}, CombineAsync<[${range(i + 1).map(v => v+1).map(j => `A${j}`).join(', ')}]>>;`
].join('')).join('\n');
//  **/

// prettier-ignore
export function pipe<Input, O1, A1 extends boolean>(exec1: Executable<Input, O1, A1>): Callable<Input, O1, CombineAsync<[A1]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>): Callable<Input, O2, CombineAsync<[A1, A2]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>): Callable<Input, O3, CombineAsync<[A1, A2, A3]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>): Callable<Input, O4, CombineAsync<[A1, A2, A3, A4]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>): Callable<Input, O5, CombineAsync<[A1, A2, A3, A4, A5]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>, exec6: Executable<O5, O6, A6>): Callable<Input, O6, CombineAsync<[A1, A2, A3, A4, A5, A6]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>, exec6: Executable<O5, O6, A6>, exec7: Executable<O6, O7, A7>): Callable<Input, O7, CombineAsync<[A1, A2, A3, A4, A5, A6, A7]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>, exec6: Executable<O5, O6, A6>, exec7: Executable<O6, O7, A7>, exec8: Executable<O7, O8, A8>): Callable<Input, O8, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean, O9, A9 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>, exec6: Executable<O5, O6, A6>, exec7: Executable<O6, O7, A7>, exec8: Executable<O7, O8, A8>, exec9: Executable<O8, O9, A9>): Callable<Input, O9, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean, O9, A9 extends boolean, O10, A10 extends boolean>(exec1: Executable<Input, O1, A1>, exec2: Executable<O1, O2, A2>, exec3: Executable<O2, O3, A3>, exec4: Executable<O3, O4, A4>, exec5: Executable<O4, O5, A5>, exec6: Executable<O5, O6, A6>, exec7: Executable<O6, O7, A7>, exec8: Executable<O7, O8, A8>, exec9: Executable<O8, O9, A9>, exec10: Executable<O9, O10, A10>): Callable<Input, O10, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>>;

export function pipe<Input>(
  firstOperator: Executable<Input, any, any>,
  ...otherOperators: Array<Executable<any, any, any>>
): Callable<Input, any, any> {
  return {} as any;
}
