import { type Option } from "./option";

export const None: Option<any> = {
  isSome: (() => {
    return false;
  }) as Option<any>["isSome"],
  isSomeAnd: ((_predicate: (value: unknown) => boolean) => {
    return false;
  }) as Option<any>["isSomeAnd"],
  isNone() {
    return true;
  },
  expect(message) {
    throw new Error(message);
  },
  unwrap() {
    throw new Error("Cannot unwrap None");
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
  into() {
    return undefined;
  },
  map() {
    return None;
  },
  inspect() {
    return None;
  },
  mapOr(defaultValue) {
    return defaultValue;
  },
  mapOrElse(defaultValue) {
    return defaultValue();
  },
  and() {
    return None;
  },
  andThen() {
    return None;
  },
  filter() {
    return None;
  },
  or(option) {
    return option;
  },
  orElse(producer) {
    return producer();
  },
  xor(option) {
    return option;
  },
  zip() {
    return None;
  },
  zipWith() {
    return None;
  },
  match(matcher) {
    return matcher.None();
  },
  toString() {
    return "None";
  },
  *[Symbol.iterator]() {
    return;
  },
};

Object.defineProperty(None, Symbol.hasInstance, {
  value(instance: unknown) {
    return (
      instance != null &&
      typeof instance === "object" &&
      "isNone" in instance &&
      typeof instance.isNone === "function" &&
      instance.isNone()
    );
  },
});
