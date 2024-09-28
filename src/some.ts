import { None } from "./none";
import { type Option } from "./option";

export function Some<T>(value: T): Option<T> {
  return {
    isSome: (() => {
      return true;
    }) as Option<T>["isSome"],
    isSomeAnd: ((predicate: (value: T) => boolean) => {
      return predicate(value);
    }) as Option<T>["isSomeAnd"],
    isNone() {
      return false;
    },
    expect() {
      return value;
    },
    unwrap() {
      return value;
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
    into() {
      return value;
    },
    map(mapper) {
      return Some(mapper(value));
    },
    inspect(callback) {
      callback(value);
      return Some(value);
    },
    mapOr(_, mapper) {
      return mapper(value);
    },
    mapOrElse(_, mapper) {
      return mapper(value);
    },
    and(option) {
      return option;
    },
    andThen(mapper) {
      return mapper(value);
    },
    filter(predicate: (value: T) => boolean) {
      return predicate(value) ? Some(value) : None;
    },
    or() {
      return Some(value);
    },
    orElse() {
      return Some(value);
    },
    xor(option) {
      return option.isNone() ? Some(value) : None;
    },
    zip(option) {
      return option.map((other) => [value, other]);
    },
    zipWith(option, zipper) {
      return option.map((other) => zipper(value, other));
    },
    match(matcher) {
      return matcher.Some(value);
    },
    toString() {
      return `Some(${value})`;
    },
    *[Symbol.iterator]() {
      yield value;
    },
  };
}

Object.defineProperty(Some, Symbol.hasInstance, {
  value(instance: unknown) {
    return (
      instance != null &&
      typeof instance === "object" &&
      "isSome" in instance &&
      typeof instance.isSome === "function" &&
      instance.isSome()
    );
  },
});
