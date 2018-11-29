export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny<Input, Output, Async> = {
  [IS_EXECUTABLE]: {
    __input: Input;
    __output: Output;
    __async: Async;
  };
};

export type Executable<Input, Output, Async> = ExecutableAny<Input, Output, Async>;

export function createExecutableAny<Input, Output, Async, Metadata>(
  data: Metadata
): ExecutableAny<Input, Output, Async> {
  return {
    [IS_EXECUTABLE]: data as any,
  };
}

export function isExecutableAny(maybe: any): maybe is ExecutableAny<any, any, any> {
  return !!maybe[IS_EXECUTABLE];
}

export function extractExecutableMetadata(executable: ExecutableAny<any, any, any>): any {
  return executable[IS_EXECUTABLE];
}

export type Context<Value> = {
  value: Value;
  state: {
    foo: string;
    bar: number;
  };
};
