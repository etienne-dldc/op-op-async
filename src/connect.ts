import { State } from './types';

export const IS_DERIVED = Symbol('IS_DERIVED');

type Derived<Output> = {
  [IS_DERIVED]: Output;
};

type Selector<Props> = (state: State) => Props;

export function derived<Props, Output>(selector: Selector<Props>, mapper: (props: Props) => Output): Derived<Output> {
  return {} as any;
}

export function useStore<Output>(derived: Derived<Output>): Output {
  return {} as any;
}
