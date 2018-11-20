import { Operator, Pass } from './op-op';

type Context<Value> = {
  value: Value;
};

type Action<Input, Output, Async extends boolean = false> = Operator<Context<Input>, Context<Output>, Async>;

function createContext<Value>(value: Value): Context<Value> {
  return {
    value,
  };
}

function execute<Input, Output, Async extends boolean>(action: Action<Input, Output, Async>) {
  return (value: Input): Async extends true ? (Output extends Promise<infer U> ? Output : Promise<Output>) : Output => {
    let isSync = false;
    let result = null;
    let err = null;
    const prom = new Promise((resolve, reject) => {
      const pass: Pass<Context<Output>> = (err, val) => {
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
      action(null, createContext(value), pass, pass);
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
