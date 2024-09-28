import { Err, Ok, Result } from "./result";
import { Option } from "./option";

export interface Task<T, E> extends PromiseLike<Result<T, E>> {
  isOk(): PromiseLike<boolean>;

  isErr(): PromiseLike<boolean>;

  isOkAnd(
    predicate: (value: T) => boolean | PromiseLike<boolean>
  ): PromiseLike<boolean>;

  isErrAnd(
    predicate: (error: E) => boolean | PromiseLike<boolean>
  ): PromiseLike<boolean>;

  ok(): PromiseLike<Option<T>>;

  err(): PromiseLike<Option<E>>;

  map<U>(mapper: (value: T) => U | PromiseLike<U>): Task<U, E>;

  mapOr<U>(
    defaultValue: U,
    mapper: (value: T) => U | PromiseLike<U>
  ): PromiseLike<U>;

  mapOrElse<U>(
    defaultValue: () => U,
    mapper: (value: T) => U | PromiseLike<U>
  ): PromiseLike<U>;

  mapErr<F>(mapper: (error: E) => F | PromiseLike<F>): Task<T, F>;

  mapBoth<U, F>(
    okMapper: (value: T) => U | PromiseLike<U>,
    errMapper: (error: E) => F | PromiseLike<F>
  ): Task<U, F>;

  inspect(callback: (value: T) => void): Task<T, E>;

  inspectErr(callback: (error: E) => void): Task<T, E>;

  expect(message: string): PromiseLike<T>;

  unwrap(): PromiseLike<T>;

  expectErr(message: string): PromiseLike<E>;

  unwrapErr(): PromiseLike<E>;
}

export function Task<T, E>(promise: PromiseLike<Result<T, E>>): Task<T, E> {
  return {
    isOk() {
      return promise.then((result) => result.isOk());
    },
    isErr() {
      return promise.then((result) => result.isErr());
    },
    isOkAnd(predicate) {
      return promise.then(
        (result) => result.isOk() && predicate(result.unwrap())
      );
    },
    isErrAnd(predicate) {
      return promise.then(
        (result) => result.isErr() && predicate(result.unwrapErr())
      );
    },
    ok() {
      return promise.then((result) => result.ok());
    },
    err() {
      return promise.then((result) => result.err());
    },
    map<U>(mapper: (value: T) => U | PromiseLike<U>) {
      return Task<U, E>(
        promise.then((result) =>
          result.isOk()
            ? (Promise.resolve(mapper(result.unwrap())).then((mapped) =>
                Ok(mapped)
              ) as PromiseLike<Result<U, E>>)
            : (result as Result<any, E>)
        )
      );
    },
    mapOr(defaultValue, mapper) {
      return promise.then((result) => result.mapOr(defaultValue, mapper));
    },
    mapOrElse(defaultValue, mapper) {
      return promise.then((result) => result.mapOrElse(defaultValue, mapper));
    },
    mapErr(mapper) {
      return Task(
        promise.then((result) =>
          result.isErr()
            ? (Promise.resolve(mapper(result.unwrapErr())).then((mapped) =>
                Err(mapped)
              ) as PromiseLike<Result<T, any>>)
            : (result as Result<T, any>)
        )
      );
    },
    mapBoth(okMapper, errMapper) {
      return Task(
        promise.then((result) =>
          result.isOk()
            ? (Promise.resolve(okMapper(result.unwrap())).then((mapped) =>
                Ok(mapped)
              ) as PromiseLike<Result<any, any>>)
            : (Promise.resolve(errMapper(result.unwrapErr())).then((mapped) =>
                Err(mapped)
              ) as PromiseLike<Result<any, any>>)
        )
      );
    },
    inspect(callback) {
      return Task(promise.then((result) => result.inspect(callback)));
    },
    inspectErr(callback) {
      return Task(promise.then((result) => result.inspectErr(callback)));
    },
    then(onFulfilled) {
      return promise.then(onFulfilled);
    },
    expect(message) {
      return promise.then((result) => result.expect(message));
    },
    unwrap() {
      return promise.then((result) => result.unwrap());
    },
    expectErr(message) {
      return promise.then((result) => result.expectErr(message));
    },
    unwrapErr() {
      return promise.then((result) => result.unwrapErr());
    },
  };
}

Task.resolve = function <T, E>(result: Result<T, E>): Task<T, E> {
  return Task(Promise.resolve(result));
};
