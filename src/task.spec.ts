import { test, expect, vi, suite } from "vitest";
import { Ok, Err, Result } from "./result";
import { Option, None, Some } from "./option";
import { Task } from "./task";

test("isOk", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.isOk()).toBe(true);
  expect(await err.isOk()).toBe(false);
});

test("isErr", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.isErr()).toBe(false);
  expect(await err.isErr()).toBe(true);
});

test("isOkAnd", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.isOkAnd((value) => value === 42)).toBe(true);
  expect(await ok.isOkAnd((value) => value === 43)).toBe(false);
  expect(await err.isOkAnd((value) => value === 42)).toBe(false);
});

test("isErrAnd", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.isErrAnd((error) => error === "error")).toBe(false);
  expect(await ok.isErrAnd((error) => error === "other")).toBe(false);
  expect(await err.isErrAnd((error) => error === "error")).toBe(true);
});

test("ok", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect((await ok.ok()).unwrap()).toBe(42);
  expect(await err.ok()).toEqual(None);
});

test("err", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.err()).toEqual(None);
  expect((await err.err()).unwrap()).toBe("error");
});

test("map", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect((await ok.map((value) => value + 1)).unwrap()).toBe(43);
  expect((await ok.map(async (value) => value + 1)).unwrap()).toBe(43);
  expect((await err.map((value) => value + 1)).unwrapErr()).toBe("error");
  expect((await err.map(async (value) => value + 1)).unwrapErr()).toBe("error");
});

test("mapOr", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(await ok.mapOr(0, async (value) => value + 1)).toBe(43);
  expect(await err.mapOr(0, async (value) => value + 1)).toBe(0);
});

test("mapOrElse", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(
    await ok.mapOrElse(
      () => 0,
      async (value) => value + 1
    )
  ).toBe(43);
  expect(
    await err.mapOrElse(
      () => 0,
      async (value) => value + 1
    )
  ).toBe(0);
});

test("mapErr", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect((await ok.mapErr(async (error) => error + "!")).unwrap()).toBe(42);
  expect((await err.mapErr(async (error) => error + "!")).unwrapErr()).toBe(
    "error!"
  );
});

test("mapBoth", async () => {
  const ok: Task<number, string> = Task.resolve(Ok(42));
  const err: Task<number, string> = Task.resolve(Err("error"));

  expect(
    (
      await ok.mapBoth(
        async (value) => value + 1,
        async (error) => error + "!"
      )
    ).unwrap()
  ).toBe(43);
  expect(
    (
      await err.mapBoth(
        async (value) => value + 1,
        async (error) => error + "!"
      )
    ).unwrapErr()
  ).toBe("error!");
});
