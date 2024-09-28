import { test, expect, vi, suite } from "vitest";
import { Some } from "./some";
import { None } from "./none";
import { Option } from "./option";

test("isSome", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.isSome()).toBe(true);
  expect(none.isSome()).toBe(false);
});

test("isSomeAnd", () => {
  const someOdd: Option<number> = Some(1);
  const someEven: Option<number> = Some(2);
  const none: Option<number> = None;
  const isEven = (value: number) => value % 2 === 0;

  expect(someOdd.isSomeAnd(isEven)).toBe(false);
  expect(someEven.isSomeAnd(isEven)).toBe(true);
  expect(none.isSomeAnd(isEven)).toBe(false);
});

test("isNone", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.isNone()).toBe(false);
  expect(none.isNone()).toBe(true);
});

test("expect", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.expect("error")).toBe(1);
  expect(() => none.expect("error")).toThrow("error");
});

test("unwrap", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.unwrap()).toBe(1);
  expect(() => none.unwrap()).toThrow("Cannot unwrap None");
});

test("unwrapOr", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.unwrapOr(2)).toBe(1);
  expect(none.unwrapOr(2)).toBe(2);
});

test("unwrapOrElse", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.unwrapOrElse(() => 2)).toBe(1);
  expect(none.unwrapOrElse(() => 2)).toBe(2);
});

test("unwrapUnchecked", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.unwrapUnchecked()).toBe(1);
  expect(none.unwrapUnchecked()).toBe(undefined);
});

test("into", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.into()).toBe(1);
  expect(none.into()).toBe(undefined);
});

test("map", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.map((x) => x + 1).unwrap()).toBe(2);
  expect(none.map((x) => x + 1).isNone()).toBe(true);
});

test("inspect", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;
  const someSpy = vi.fn();
  const noneSpy = vi.fn();

  some.inspect(someSpy);
  none.inspect(noneSpy);

  expect(someSpy).toHaveBeenCalledWith(1);
  expect(noneSpy).not.toHaveBeenCalled();
});

test("mapOr", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.mapOr(2, (x) => x + 1)).toBe(2);
  expect(none.mapOr(2, (x) => x + 1)).toBe(2);
});

test("mapOrElse", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(
    some.mapOrElse(
      () => 2,
      (x) => x + 1
    )
  ).toBe(2);
  expect(
    none.mapOrElse(
      () => 2,
      (x) => x + 1
    )
  ).toBe(2);
});

test("and", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.and(Some(2)).unwrap()).toBe(2);
  expect(none.and(Some(2)).isNone()).toBe(true);
});

test("andThen", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.andThen((x) => Some(x + 1)).unwrap()).toBe(2);
  expect(none.andThen((x) => Some(x + 1)).isNone()).toBe(true);
});

test("filter", () => {
  const someOdd: Option<number> = Some(1);
  const someEven: Option<number> = Some(2);
  const none: Option<number> = None;
  const isEven = (value: number) => value % 2 === 0;

  expect(someOdd.filter(isEven).isNone()).toBe(true);
  expect(someEven.filter(isEven).unwrap()).toBe(2);
  expect(none.filter(isEven).isNone()).toBe(true);
});

test("or", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.or(Some(2)).unwrap()).toBe(1);
  expect(none.or(Some(2)).unwrap()).toBe(2);
});

test("orElse", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.orElse(() => Some(2)).unwrap()).toBe(1);
  expect(none.orElse(() => Some(2)).unwrap()).toBe(2);
});

test("xor", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.xor(Some(2)).isNone()).toBe(true);
  expect(some.xor(None).unwrap()).toBe(1);
  expect(none.xor(Some(2)).unwrap()).toBe(2);
  expect(none.xor(None).isNone()).toBe(true);
});

test("zip", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.zip(Some(2)).unwrap()).toEqual([1, 2]);
  expect(none.zip(Some(2)).isNone()).toBe(true);
});

test("zipWith", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.zipWith(Some(2), (x, y) => x + y).unwrap()).toBe(3);
  expect(none.zipWith(Some(2), (x, y) => x + y).isNone()).toBe(true);
});

test("match", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(
    some.match({
      Some: (value) => value + 1,
      None: () => 0,
    })
  ).toBe(2);
  expect(
    none.match({
      Some: (value) => value + 1,
      None: () => 0,
    })
  ).toBe(0);
});

test("toString", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some.toString()).toBe("Some(1)");
  expect(none.toString()).toBe("None");
});

test("iterable", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect([...some]).toEqual([1]);
  expect([...none]).toEqual([]);
});

test("instanceof", () => {
  const some: Option<number> = Some(1);
  const none: Option<number> = None;

  expect(some).toBeInstanceOf(Some);
  expect(none).toBeInstanceOf(None);
});

suite("static", () => {
  test("unzip", () => {
    const option: Option<[number, number]> = Some([1, 2]);
    const [first, second] = Option.unzip(option);

    expect(first.unwrap()).toBe(1);
    expect(second.unwrap()).toBe(2);
  });

  test("flatten", () => {
    const option: Option<Option<number>> = Some(Some(1));
    const value = Option.flatten(option);

    expect(value.unwrap()).toBe(1);
  });

  test("from", () => {
    const some = Option.from(1);
    const none = Option.from(null);

    expect(some.unwrap()).toBe(1);
    expect(none.isNone()).toBe(true);
  });

  test("fromFalsy", () => {
    const some = Option.fromFalsy(1);
    const none = Option.fromFalsy(0);

    expect(some.unwrap()).toBe(1);
    expect(none.isNone()).toBe(true);
  });

  test("all", () => {
    const some = Option.all([Some(1), Some(2), Some(3)]);
    const none = Option.all([Some(1), None, Some(3)]);

    expect(some.unwrap()).toEqual([1, 2, 3]);
    expect(none.isNone()).toBe(true);
  });

  test("any", () => {
    const some = Option.any([None, Some(2), None]);
    const none = Option.any([None, None, None]);

    expect(some.unwrap()).toBe(2);
    expect(none.isNone()).toBe(true);
  });

  test("bind", () => {
    const some = Option.bind<number, number>(function* () {
      const x = yield Some(1);
      const y = yield Some(2);
      const z = yield Some(3);

      return x + y + z;
    });
    const none = Option.bind<number, number>(function* () {
      const x = yield Some(1);
      const y = yield None;
      const z = yield Some(3);

      return x + y + z;
    });

    expect(some.unwrap()).toBe(6);
    expect(none.isNone()).toBe(true);
  });

  test("bindAsync", async () => {
    const some = await Option.bindAsync<number, number>(async function* () {
      const x = yield await Promise.resolve(Some(1));
      const y = yield await Promise.resolve(Some(2));
      const z = yield await Promise.resolve(Some(3));

      return x + y + z;
    });
    const none = await Option.bindAsync<number, number>(async function* () {
      const x = yield await Promise.resolve(Some(1));
      const y = yield await Promise.resolve(None);
      const z = yield await Promise.resolve(Some(3));

      return x + y + z;
    });

    expect(some.unwrap()).toBe(6);
    expect(none.isNone()).toBe(true);
  });
});
