import { None } from "./none";
import type { Result } from "./result";
import { Some } from "./some";

export function Ok<T>(value: T): Result<T, any> {
  return {
    isOk: (() => {
      return true;
    }) as Result<T, any>["isOk"],
    isErr: (() => {
      return false;
    }) as Result<T, any>["isErr"],
    isOkAnd: ((predicate: (value: T) => boolean) => {
      return predicate(value);
    }) as Result<T, any>["isOkAnd"],
    isErrAnd: ((_predicate: (error: unknown) => boolean) => {
      return false;
    }) as Result<T, any>["isErrAnd"],
    ok() {
      return Some(value);
    },
    err() {
      return None;
    },
    map(mapper) {
      return Ok(mapper(value));
    },
    mapOr(_, mapper) {
      return mapper(value);
    },
    mapOrElse(_, mapper) {
      return mapper(value);
    },
    mapErr() {
      return Ok(value);
    },
    mapBoth(okMapper) {
      return Ok(okMapper(value));
    },
    inspect(callback) {
      callback(value);
      return Ok(value);
    },
    inspectErr() {
      return Ok(value);
    },
    expect() {
      return value;
    },
    unwrap() {
      return value;
    },
    expectErr(message) {
      throw new Error(message);
    },
    unwrapErr() {
      throw new Error("Cannot unwrap Ok");
    },
    and(result) {
      return result;
    },
    andThen(mapper) {
      return mapper(value);
    },
    or() {
      return Ok(value);
    },
    orElse() {
      return Ok(value);
    },
    unwrapOr() {
      return value;
    },
    unwrapOrElse() {
      return value;
    },
    unwrapUnchecked() {
      return value;
    },
    unwrapErrOr(defaultValue) {
      return defaultValue;
    },
    unwrapErrOrElse(defaultValue) {
      return defaultValue();
    },
    unwrapErrUnchecked() {
      return undefined;
    },
    into() {
      return value;
    },
    intoTuple() {
      return [null, value];
    },
    toString() {
      return `Ok(${value})`;
    },
    *[Symbol.iterator]() {
      yield value;
    },
  };
}

Object.defineProperty(Ok, Symbol.hasInstance, {
  value: (instance: unknown) => {
    return (
      instance != null &&
      typeof instance === "object" &&
      "isOk" in instance &&
      typeof instance.isOk === "function" &&
      instance.isOk()
    );
  },
});
