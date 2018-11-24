export type OppError = any;

export type SuccessExit<Output> = (val: Output, ctx: Devtools) => void;
export type ErrorExit = (err: OppError, ctx: Devtools) => void;

export type Exits<Output> = {
  resolve: SuccessExit<Output>;
  interrupt: SuccessExit<Output>;
  reject: ErrorExit;
};

type DevtoolsToken = string;

type DevtoolsObject = {
  start: () => DevtoolsToken;
};

type DevtoolsActions = {
  start: () => void;
};

export type Devtools = {
  withDebug: <Output>(exits: Exits<Output>, name: string) => DevtoolsActions & Exits<Output>;
};

export type OnResolve<Input, Output> = (val: Input, exits: Exits<Output>, ctx: Devtools) => void;
export type OnReject<Output> = (err: OppError, exits: Exits<Output>, ctx: Devtools) => void;

export type Operator<Input, Output, Async extends boolean = false> = {
  resolve: OnResolve<Input, Output>;
  reject: OnReject<Output>;
};

const defaultReject: OnReject<any> = (err, exits, ctx) => {
  const { reject, start } = ctx.withDebug(exits, '??');
  start();
  reject(err, ctx);
};

export function createOpp<Input, Output, Async extends boolean = false>(
  onResolve: OnResolve<Input, Output>,
  onReject: OnReject<Output> = defaultReject
): Operator<Input, Output, Async> {
  return {
    resolve: onResolve,
    reject: onReject,
  };
}

let uniqId = 0;
let uniqActionId = 0;

const createDevTools = (actionId: number, runId: number, actionName: string): Devtools => {
  return {
    withDebug: (exits, name) => {
      const id = uniqId++;
      return {
        resolve: (val, ctx) => {
          console.log({ actionId, actionName, runId, name, id, type: 'resolve', value: val });
          exits.resolve(val, ctx);
        },
        interrupt: (val, ctx) => {
          console.log({ actionId, actionName, runId, name, id, type: 'interrupt', value: val });
          exits.interrupt(val, ctx);
        },
        reject: (err, ctx) => {
          console.log({ actionId, actionName, runId, name, id, type: 'reject', error: err });
          exits.reject(err, ctx);
        },
        start: () => {
          console.log({ actionId, actionName, runId, name, id, type: 'start' });
        },
      };
    },
  };
};

export function makeExecutable<Input, Output, Async extends boolean>(
  operator: Operator<Input, Output, Async>,
  actionName: string
) {
  let uniqRunId = 0;
  const actionId = uniqActionId++;
  return (value: Input): Async extends true ? (Output extends Promise<infer U> ? Output : Promise<Output>) : Output => {
    const runId = uniqRunId++;
    let isSyncSuccess = false;
    let isSyncError = false;
    let result = null;
    let err = null;
    const prom = new Promise((resolve, reject) => {
      const successExit: SuccessExit<Output> = val => {
        if (isSyncSuccess || isSyncError) {
          throw new Error('Already ended signal !');
        }
        isSyncSuccess = true;
        result = val;
        resolve(val);
      };
      const exits: Exits<Output> = {
        resolve: successExit,
        interrupt: successExit,
        reject: err => {
          if (isSyncSuccess || isSyncError) {
            throw new Error('Already ended signal !');
          }
          isSyncError = true;
          err = err;
          reject(err);
        },
      };
      operator.resolve(value, exits, createDevTools(actionId, runId, actionName));
    });
    if (isSyncSuccess) {
      return result as any;
    }
    if (isSyncError) {
      prom.catch(err => {
        console.log(err);
      });
      throw err;
    }
    return prom as any;
  };
}

/**
 * OPERATORS
 */

function isPromise<T>(maybe: any): maybe is Promise<T> {
  return Promise.resolve(maybe) === maybe;
}

export function transform<Input, Output>(
  operation: (value: Input) => Output
): Output extends Promise<infer U> ? Operator<Input, U, true> : Operator<Input, Output, false> {
  return createOpp<Input, Output extends Promise<infer U> ? U : Output>((val, exits, ctx) => {
    const { resolve, reject, start } = ctx.withDebug(exits, 'transform');
    start();
    try {
      const result = operation(val);
      if (isPromise<any>(result)) {
        result.then(v => resolve(v, ctx)).catch(e => reject(e, ctx));
      } else {
        resolve(result as any, ctx);
      }
    } catch (error) {
      reject(error, ctx);
    }
  }) as any;
}

export function filter<Input, Output extends boolean | Promise<boolean>>(
  operation: (val: Input) => Output
): Output extends Promise<infer U> ? Operator<Input, Input, true> : Operator<Input, Input, false> {
  return createOpp((val, exits, ctx) => {
    const { reject, resolve, interrupt, start } = ctx.withDebug(exits, 'filter');
    start();
    try {
      const shouldContinue = operation(val as any);
      if (isPromise<boolean>(shouldContinue)) {
        shouldContinue.then(v => (v ? resolve(val, ctx) : interrupt(val, ctx))).catch(e => reject(e, ctx));
      } else {
        if (shouldContinue) {
          resolve(val, ctx);
        } else {
          interrupt(val, ctx);
        }
      }
    } catch (error) {
      reject(error, ctx);
    }
  }) as any;
}

export type CombineAsync<Vals extends Array<boolean>> = Vals extends Array<false> ? false : true;

/**
var range = num => Array(num).fill(null).map((v, i) => i);
range(10).map(i => [
  `// prettier-ignore\n`,
  `export function pipe<Input, ${range(i + 1).map(v => v+1).map(j => `O${j}, A${j} extends boolean`).join(', ')}>`,
  `(${range(i + 1).map(v => v+1).map(j => `operator${j}: Operator<${j === 1 ? 'Input' : `O${j - 1}`}, O${j}, A${j}>`).join(', ')}): `,
  `Operator<Input, O${i + 1}, CombineAsync<[${range(i + 1).map(v => v+1).map(j => `A${j}`).join(', ')}]>>;`
].join('')).join('\n');
 **/

// prettier-ignore
export function pipe<Input, O1, A1 extends boolean>(operator1: Operator<Input, O1, A1>): Operator<Input, O1, CombineAsync<[A1]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>): Operator<Input, O2, CombineAsync<[A1, A2]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>): Operator<Input, O3, CombineAsync<[A1, A2, A3]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>): Operator<Input, O4, CombineAsync<[A1, A2, A3, A4]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>): Operator<Input, O5, CombineAsync<[A1, A2, A3, A4, A5]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>, operator6: Operator<O5, O6, A6>): Operator<Input, O6, CombineAsync<[A1, A2, A3, A4, A5, A6]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>, operator6: Operator<O5, O6, A6>, operator7: Operator<O6, O7, A7>): Operator<Input, O7, CombineAsync<[A1, A2, A3, A4, A5, A6, A7]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>, operator6: Operator<O5, O6, A6>, operator7: Operator<O6, O7, A7>, operator8: Operator<O7, O8, A8>): Operator<Input, O8, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean, O9, A9 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>, operator6: Operator<O5, O6, A6>, operator7: Operator<O6, O7, A7>, operator8: Operator<O7, O8, A8>, operator9: Operator<O8, O9, A9>): Operator<Input, O9, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>>;
// prettier-ignore
export function pipe<Input, O1, A1 extends boolean, O2, A2 extends boolean, O3, A3 extends boolean, O4, A4 extends boolean, O5, A5 extends boolean, O6, A6 extends boolean, O7, A7 extends boolean, O8, A8 extends boolean, O9, A9 extends boolean, O10, A10 extends boolean>(operator1: Operator<Input, O1, A1>, operator2: Operator<O1, O2, A2>, operator3: Operator<O2, O3, A3>, operator4: Operator<O3, O4, A4>, operator5: Operator<O4, O5, A5>, operator6: Operator<O5, O6, A6>, operator7: Operator<O6, O7, A7>, operator8: Operator<O7, O8, A8>, operator9: Operator<O8, O9, A9>, operator10: Operator<O9, O10, A10>): Operator<Input, O10, CombineAsync<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>>;

export function pipe<Input>(
  firstOperator: Operator<Input, any>,
  ...otherOperators: Array<Operator<any, any>>
): Operator<Input, any> {
  const operators: Array<Operator<any, any>> = [firstOperator, ...otherOperators];
  const createExits = (nextOperatorIndex: number, exits: Exits<any>, ctx: Devtools): Exits<any> => {
    const nextOperator = operators[nextOperatorIndex];
    return {
      resolve: opVal => {
        if (nextOperator) {
          nextOperator.resolve(opVal, createExits(nextOperatorIndex + 1, exits, ctx), ctx);
        } else {
          exits.resolve(opVal, ctx);
        }
      },
      reject: opErr => {
        if (nextOperator) {
          nextOperator.reject(opErr, createExits(nextOperatorIndex + 1, exits, ctx), ctx);
        } else {
          exits.reject(opErr, ctx);
        }
      },
      interrupt: exits.interrupt,
    };
  };
  return createOpp(
    (val, exits, ctx) => {
      operators[0].resolve(val, createExits(1, exits, ctx), ctx);
    },
    (err, exits, ctx) => {
      operators[0].reject(err, createExits(1, exits, ctx), ctx);
    }
  );
}
