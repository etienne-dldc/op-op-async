export type OpError = any;

export type Pass<Output> = (err: OpError, value?: Output) => void;

export type CombineAsync<Vals extends Array<boolean>> = Vals extends Array<false> ? false : true;

export type Operator<Input, Output, Async extends boolean = false> = (
  err: OpError,
  value: Input,
  next: Pass<Output>,
  complete?: Pass<Output>
) => void;

function isPromise(maybe: any): maybe is Promise<any> {
  return Promise.resolve(maybe) === maybe;
}

type Unwrap<Val> = Val extends Promise<infer U> ? U : Val;

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
  return (err, value, next, complete = next) => {
    if (err) next(err);
    else {
      const runNextOperator = (operatorIndex: number, operatorError: any, operatorValue: any): void => {
        const operator = operators[operatorIndex];
        if (operatorError) {
          next(operatorError);
        } else if (operator) {
          operator(null, operatorValue, runNextOperator.bind(null, operatorIndex + 1), complete);
        } else {
          next(null, operatorValue);
        }
      };
      runNextOperator(0, null, value);
    }
  };
}

export function toAsyncValue<Input, Output>(
  operator: Operator<Input, Output>
): Output extends Promise<infer U> ? Operator<Input, U, true> : Operator<Input, Output, false> {
  const handle = (pass: Pass<Unwrap<Output>>): Pass<Output> => (hErr, hVal) => {
    if (isPromise(hVal)) {
      hVal
        .then(val => {
          pass(hErr, val);
        })
        .catch(err => {
          if (hErr) {
            pass(hErr);
          } else {
            pass(err);
          }
        });
    } else {
      pass(hErr, hVal as any);
    }
  };
  return ((err: OpError, value: Input, next: Pass<Unwrap<Output>>, complete = next) => {
    operator(err, value, handle(next), handle(complete));
  }) as any;
}

export function mapSync<Input, Output>(operation: (value: Input) => Output): Operator<Input, Output> {
  return (err, value, next) => {
    if (err) {
      next(err);
    } else {
      try {
        const result = operation(value);
        next(null, result);
      } catch (error) {
        next(error);
      }
    }
  };
}

export function map<Input, Output>(operation: (value: Input) => Output) {
  return toAsyncValue(mapSync(operation));
}

export function filterSync<Input>(operation: (value: Input) => boolean): Operator<Input, Input> {
  return (err, value, next, complete = next) => {
    if (err) next(err);
    else if (operation(value)) next(null, value);
    else complete(null, value);
  };
}

// export function filter<Input>(operation: (value: Input) => boolean): Operator<Input, Input> {
//   return toAsync<Input, Input>(filterSync(operation));
// }

export function execute<Input, Output, Async extends boolean>(action: Operator<Input, Output, Async>) {
  return (value: Input): Async extends true ? (Output extends Promise<infer U> ? Output : Promise<Output>) : Output => {
    let isSync = false;
    let result = null;
    let err = null;
    const prom = new Promise((resolve, reject) => {
      const pass: Pass<Output> = (err, val) => {
        if (isSync) {
          throw new Error('Already ended signal !');
        }
        isSync = true;
        result = val;
        err = err;
        if (err !== null) {
          reject(err);
        } else {
          resolve(val);
        }
      };
      action(null, value, pass, pass);
    });
    if (isSync) {
      if (err !== null) {
        throw err;
      }
      return result as any;
    }
    return prom as any;
  };
}
