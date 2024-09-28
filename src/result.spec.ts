import { test, expect, vi, suite } from "vitest";
import { Ok, Err, Result } from "./result";
import { Option, None, Some } from "./option";

test("isOk", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.isOk()).toBe(true);
  expect(err.isOk()).toBe(false);
});

test("isErr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.isErr()).toBe(false);
  expect(err.isErr()).toBe(true);
});

test("isOkAnd", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.isOkAnd(() => true)).toBe(true);
  expect(ok.isOkAnd(() => false)).toBe(false);
  expect(err.isOkAnd(() => true)).toBe(false);
  expect(err.isOkAnd(() => false)).toBe(false);
});

test("isErrAnd", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.isErrAnd(() => true)).toBe(false);
  expect(ok.isErrAnd(() => false)).toBe(false);
  expect(err.isErrAnd(() => true)).toBe(true);
  expect(err.isErrAnd(() => false)).toBe(false);
});

test("ok", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.ok().unwrap()).toBe(1);
  expect(err.ok().isNone()).toBe(true);
});

test("err", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.err().isNone()).toBe(true);
  expect(err.err().unwrap()).toBe("error");
});

test("map", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.map((value) => value + 1).unwrap()).toBe(2);
  expect(err.map((value) => value + 1).unwrapErr()).toBe("error");
});

test("mapOr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.mapOr(2, (value) => value + 1)).toBe(2);
  expect(err.mapOr(2, (value) => value + 1)).toBe(2);
});

test("mapOrElse", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(
    ok.mapOrElse(
      () => 2,
      (value) => value + 1
    )
  ).toBe(2);
  expect(
    err.mapOrElse(
      () => 2,
      (value) => value + 1
    )
  ).toBe(2);
});

test("mapErr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.mapErr((error) => error + "1").unwrap()).toBe(1);
  expect(err.mapErr((error) => error + "1").unwrapErr()).toBe("error1");
});

test("mapBoth", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(
    ok
      .mapBoth(
        (value) => value + 1,
        (error) => error + "1"
      )
      .unwrap()
  ).toBe(2);
  expect(
    err
      .mapBoth(
        (value) => value + 1,
        (error) => error + "1"
      )
      .unwrapErr()
  ).toBe("error1");
});

test("inspect", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");
  const okSpy = vi.fn();
  const errSpy = vi.fn();

  ok.inspect(okSpy);
  err.inspect(errSpy);

  expect(okSpy).toHaveBeenCalledWith(1);
  expect(errSpy).not.toHaveBeenCalled();
});

test("inspectErr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");
  const okSpy = vi.fn();
  const errSpy = vi.fn();

  ok.inspectErr(okSpy);
  err.inspectErr(errSpy);

  expect(okSpy).not.toHaveBeenCalled();
  expect(errSpy).toHaveBeenCalledWith("error");
});

test("expect", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.expect("error")).toBe(1);
  expect(() => err.expect("error")).toThrowError("error");
});

test("unwrap", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrap()).toBe(1);
  expect(() => err.unwrap()).toThrowError("Cannot unwrap Err");
});

test("expectErr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(err.expectErr("error")).toBe("error");
  expect(() => ok.expectErr("error")).toThrowError("error");
});

test("unwrapErr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(err.unwrapErr()).toBe("error");
  expect(() => ok.unwrapErr()).toThrowError("Cannot unwrap Ok");
});

test("and", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.and(Ok(2)).unwrap()).toBe(2);
  expect(ok.and(Err("error1")).unwrapErr()).toBe("error1");
  expect(err.and(Ok(2)).unwrapErr()).toBe("error");
  expect(err.and(Err("error1")).unwrapErr()).toBe("error");
});

test("andThen", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.andThen((value) => Ok(value + 1)).unwrap()).toBe(2);
  expect(ok.andThen((value) => Err("error1")).unwrapErr()).toBe("error1");
  expect(err.andThen((value) => Ok(value + 1)).unwrapErr()).toBe("error");
  expect(err.andThen((value) => Err("error1")).unwrapErr()).toBe("error");
});

test("or", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.or(Ok(2)).unwrap()).toBe(1);
  expect(ok.or(Err("error1")).unwrap()).toBe(1);
  expect(err.or(Ok(2)).unwrap()).toBe(2);
  expect(err.or(Err("error1")).unwrapErr()).toBe("error1");
});

test("orElse", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.orElse(() => Ok(2)).unwrap()).toBe(1);
  expect(ok.orElse(() => Err("error1")).unwrap()).toBe(1);
  expect(err.orElse(() => Ok(2)).unwrap()).toBe(2);
  expect(err.orElse(() => Err("error1")).unwrapErr()).toBe("error1");
});

test("unwrapOr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapOr(2)).toBe(1);
  expect(err.unwrapOr(2)).toBe(2);
});

test("unwrapOrElse", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapOrElse(() => 2)).toBe(1);
  expect(err.unwrapOrElse(() => 2)).toBe(2);
});

test("unwrapUnchecked", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapUnchecked()).toBe(1);
  expect(err.unwrapUnchecked()).toBe(undefined);
});

test("unwrapErrOr", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapErrOr("error1")).toBe("error1");
  expect(err.unwrapErrOr("error1")).toBe("error");
});

test("unwrapErrOrElse", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapErrOrElse(() => "error1")).toBe("error1");
  expect(err.unwrapErrOrElse(() => "error1")).toBe("error");
});

test("unwrapErrUnchecked", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.unwrapErrUnchecked()).toBe(undefined);
  expect(err.unwrapErrUnchecked()).toBe("error");
});

test("into", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.into()).toBe(1);
  expect(err.into()).toBe("error");
});

test("intoTuple", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.intoTuple()).toEqual([null, 1]);
  expect(err.intoTuple()).toEqual(["error", null]);
});

test("toString", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok.toString()).toBe("Ok(1)");
  expect(err.toString()).toBe("Err(error)");
});

test("iterable", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect([...ok]).toEqual([1]);
  expect([...err]).toEqual([]);
});

test("instanceof", () => {
  const ok: Result<number, string> = Ok(1);
  const err: Result<number, string> = Err("error");

  expect(ok).toBeInstanceOf(Ok);
  expect(err).toBeInstanceOf(Err);
});

suite("static", () => {
  test("transpose", () => {
    const okSome: Result<Option<number>, string> = Ok(Some(1));
    const okNone: Result<Option<number>, string> = Ok(None);
    const err: Result<Option<number>, string> = Err("error");

    const someOk = Result.transpose(okSome);
    const noneOk = Result.transpose(okNone);
    const someErr = Result.transpose(err);

    expect(someOk.unwrap().unwrap()).toBe(1);
    expect(noneOk.isNone()).toBe(true);
    expect(someErr.unwrap().isErr()).toBe(true);
  });

  test("flatten", () => {
    const ok: Result<Result<number, string>, string> = Ok(Ok(1));
    const err: Result<Result<number, string>, string> = Err("error");

    expect(Result.flatten(ok).unwrap()).toBe(1);
    expect(Result.flatten(err).unwrapErr()).toBe("error");
  });

  test("try", () => {
    const ok = Result.try(() => 1);
    const err = Result.try(() => {
      throw new Error("error");
    });

    expect(ok.unwrap()).toBe(1);
    expect(err.unwrapErr()).toBeInstanceOf(Error);
  });

  test("tryAsync", async () => {
    const ok = await Result.tryAsync(async () => 1);
    const err = await Result.tryAsync(async () => {
      throw new Error("error");
    });

    expect(ok.unwrap()).toBe(1);
    expect(err.unwrapErr()).toBeInstanceOf(Error);
  });

  test("all", () => {
    const ok1: Result<number, string> = Ok(1);
    const ok2: Result<number, string> = Ok(2);
    const err: Result<number, string> = Err("error");

    const allOk = Result.all([ok1, ok2]);
    const allErr = Result.all([ok1, err]);

    expect(allOk.unwrap()).toEqual([1, 2]);
    expect(allErr.unwrapErr()).toBe("error");
  });

  test("any", () => {
    const ok1: Result<number, string> = Ok(1);
    const ok2: Result<number, string> = Ok(2);
    const err: Result<number, string> = Err("error");

    const anyOk = Result.any([ok1, ok2]);
    const anyErr = Result.any([err, err]);

    expect(anyOk.unwrap()).toBe(1);
    expect(anyErr.unwrapErr()).toEqual(["error", "error"]);
  });
});
