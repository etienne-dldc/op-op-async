import { Executable } from './types';

export function run<Output, Async extends boolean>(
  exec: Executable<null, Output, Async, false>
): Async extends true ? Promise<Output> : Output {
  return {} as any;
}
