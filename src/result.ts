import { Ok } from "./ok";
import { Err } from "./err";
import { Option } from "./option";
import { None } from "./none";
import { Some } from "./some";

export { Ok, Err };

export interface Result<T, E> extends Iterable<T> {
  isOk(): this is typeof Ok<T>;

  isErr(): this is typeof Err<E>;

  isOkAnd<U extends T>(
    predicate: (value: T) => value is U
  ): this is typeof Ok<U>;
  isOkAnd(predicate: (value: T) => boolean): this is typeof Ok<T>;

  isErrAnd<U extends E>(
    predicate: (error: E) => error is U
  ): this is typeof Err<U>;
  isErrAnd(predicate: (error: E) => boolean): this is typeof Err<E>;

  ok(): Option<T>;

  err(): Option<E>;

  map<U>(mapper: (value: T) => U): Result<U, E>;

  mapOr<U>(defaultValue: U, mapper: (value: T) => U): U;

  mapOrElse<U>(defaultValue: () => U, mapper: (value: T) => U): U;

  mapErr<F>(mapper: (error: E) => F): Result<T, F>;

  mapBoth<U, F>(
    okMapper: (value: T) => U,
    errMapper: (error: E) => F
  ): Result<U, F>;

  inspect(callback: (value: T) => void): Result<T, E>;

  inspectErr(callback: (error: E) => void): Result<T, E>;

  expect(message: string): T;

  unwrap(): T;

  expectErr(message: string): E;

  unwrapErr(): E;

  and<U>(result: Result<U, E>): Result<U, E>;

  andThen<U>(mapper: (value: T) => Result<U, E>): Result<U, E>;

  or<F>(result: Result<T, F>): Result<T, F>;

  orElse<F>(mapper: (error: E) => Result<T, F>): Result<T, F>;

  unwrapOr(defaultValue: T): T;

  unwrapOrElse(defaultValue: () => T): T;

  unwrapUnchecked(): T;

  unwrapErrOr(defaultValue: E): E;

  unwrapErrOrElse(defaultValue: () => E): E;

  unwrapErrUnchecked(): E;

  into(): T | E;

  intoTuple(): [null, T] | [E, null];

  toString(): string;
}

export const Result = {
  transpose<T, E>(result: Result<Option<T>, E>): Option<Result<T, E>> {
    return result.isOkAnd((value) => value.isSome()) || result.isErr()
      ? Some(result.map((value) => value.unwrap()))
      : None;
  },
  flatten<T, E>(result: Result<Result<T, E>, E>): Result<T, E> {
    return result.andThen((value) => value);
  },
  try<T>(producer: () => T): Result<T, unknown> {
    try {
      return Ok(producer());
    } catch (error) {
      return Err(error);
    }
  },
  async tryAsync<T>(
    producer: () => Promise<T>
  ): Promise<Result<Awaited<T>, unknown>> {
    try {
      return Ok(await producer());
    } catch (error) {
      return Err(error);
    }
  },
  all<T, E>(results: Result<T, E>[]): Result<T[], E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isErr()) {
        return Err(result.unwrapErr());
      }
      values.push(result.unwrap());
    }
    return Ok(values);
  },
  any<T, E>(results: Result<T, E>[]): Result<T, E[]> {
    const errors: E[] = [];
    for (const result of results) {
      if (result.isOk()) {
        return Ok(result.unwrap());
      } else {
        errors.push(result.unwrapErr());
      }
    }
    return Err(errors);
  },
};
