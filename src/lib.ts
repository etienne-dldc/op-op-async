import { Executable } from './types';

export function run<Output, Async>(
  exec: Executable<null, Output, Async>
): Async extends true ? Promise<Output> : Output {
  return {} as any;
}
