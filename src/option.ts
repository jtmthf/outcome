import { None } from "./none";
import { Some } from "./some";

export { Some, None };

export interface Option<T> extends Iterable<T> {
  isSome(): this is typeof Some;

  isSomeAnd<U extends T>(
    predicate: (value: T) => value is U
  ): this is typeof Some<U>;
  isSomeAnd(predicate: (value: T) => boolean): this is typeof Some<T>;

  isNone(): boolean;

  expect(message: string): T;

  unwrap(): T;

  unwrapOr(defaultValue: T): T;

  unwrapOrElse(defaultValue: () => T): T;

  unwrapUnchecked(): T;

  into(): T | undefined;

  map<U>(mapper: (value: T) => U): Option<U>;

  inspect(callback: (value: T) => void): Option<T>;

  mapOr<U>(defaultValue: U, mapper: (value: T) => U): U;

  mapOrElse<U>(defaultValue: () => U, mapper: (value: T) => U): U;

  and<U>(option: Option<U>): Option<U>;

  andThen<U>(mapper: (value: T) => Option<U>): Option<U>;

  filter<U extends T>(predicate: (value: T) => value is U): Option<U>;
  filter(predicate: (value: T) => boolean): Option<T>;

  or(option: Option<T>): Option<T>;

  orElse(producer: () => Option<T>): Option<T>;

  xor(option: Option<T>): Option<T>;

  zip<U>(option: Option<U>): Option<[T, U]>;

  zipWith<U, R>(
    option: Option<U>,
    zipper: (first: T, second: U) => R
  ): Option<R>;

  match<U, V>(matcher: { Some: (value: T) => U; None: () => V }): U | V;

  toString(): string;
}

export const Option = {
  unzip<T, U>(option: Option<[T, U]>): [Option<T>, Option<U>] {
    return [
      option.map(([first]) => first),
      option.map(([_, second]) => second),
    ];
  },
  flatten<T>(option: Option<Option<T>>): Option<T> {
    return option.andThen((value) => value);
  },
  from<T>(value: T | null | undefined): Option<NonNullable<T>> {
    return value == null ? None : Some(value);
  },
  fromFalsy<T>(value: T | null | undefined): Option<NonNullable<T>> {
    return value ? Some(value) : None;
  },
  all<T>(options: Iterable<Option<T>>): Option<T[]> {
    const values: T[] = [];
    for (const option of options) {
      if (option.isNone()) {
        return None;
      }
      values.push(option.unwrap());
    }
    return Some(values);
  },
  any<T>(options: Iterable<Option<T>>): Option<T> {
    for (const option of options) {
      if (option.isSome()) {
        return option;
      }
    }
    return None;
  },
  bind<T, U>(generator: () => Generator<Option<T>, U, T>): Option<U> {
    const iterator = generator();
    let result = iterator.next();
    while (!result.done) {
      if (result.value.isNone()) {
        return None;
      }
      result = iterator.next(result.value.unwrap());
    }
    return Some(result.value);
  },
  async bindAsync<T, U>(
    generator: () => AsyncGenerator<Option<T>, U, T>
  ): Promise<Option<U>> {
    const iterator = generator();
    let result = await iterator.next();
    while (!result.done) {
      if (result.value.isNone()) {
        return None;
      }
      result = await iterator.next(result.value.unwrap());
    }
    return Some(result.value);
  },
};
