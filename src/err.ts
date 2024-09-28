import { None } from "./none";
import type { Result } from "./result";
import { Some } from "./some";

export function Err<E>(error: E): Result<any, E> {
  return {
    isOk: (() => {
      return false;
    }) as Result<any, E>["isOk"],
    isErr: (() => {
      return true;
    }) as Result<any, E>["isErr"],
    isOkAnd: ((_predicate: (value: unknown) => boolean) => {
      return false;
    }) as Result<any, E>["isOkAnd"],
    isErrAnd: ((predicate: (error: E) => boolean) => {
      return predicate(error);
    }) as Result<any, E>["isErrAnd"],
    ok() {
      return None;
    },
    err() {
      return Some(error);
    },
    map() {
      return Err(error);
    },
    mapOr(defaultValue) {
      return defaultValue;
    },
    mapOrElse(defaultValue) {
      return defaultValue();
    },
    mapErr(mapper) {
      return Err(mapper(error));
    },
    mapBoth(_, errMapper) {
      return Err(errMapper(error));
    },
    inspect() {
      return Err(error);
    },
    inspectErr(callback) {
      callback(error);
      return Err(error);
    },
    expect(message) {
      throw new Error(message);
    },
    unwrap() {
      throw new Error("Cannot unwrap Err");
    },
    expectErr() {
      return error;
    },
    unwrapErr() {
      return error;
    },
    and() {
      return Err(error);
    },
    andThen() {
      return Err(error);
    },
    or(result) {
      return result;
    },
    orElse(mapper) {
      return mapper(error);
    },
    unwrapOr(defaultValue) {
      return defaultValue;
    },
    unwrapOrElse(defaultValue) {
      return defaultValue();
    },
    unwrapUnchecked() {
      return undefined;
    },
    unwrapErrOr() {
      return error;
    },
    unwrapErrOrElse() {
      return error;
    },
    unwrapErrUnchecked() {
      return error;
    },
    into() {
      return error;
    },
    intoTuple() {
      return [error, null];
    },
    toString() {
      return `Err(${error})`;
    },
    *[Symbol.iterator]() {
      return;
    },
  };
}

Object.defineProperty(Err, Symbol.hasInstance, {
  value(instance: any) {
    return (
      instance != null &&
      typeof instance === "object" &&
      "isErr" in instance &&
      typeof instance.isErr === "function" &&
      instance.isErr()
    );
  },
});
