import { expect, it } from "vitest";
import { MultiKeyMap } from "../src/index.js";

type ValueType = {
  username: string;
  ssn: string;
  uniqueSymbol: Symbol;
};

it("should work", () => {
  const map = new MultiKeyMap<ValueType, string | Symbol>([
    (value: ValueType) => value.ssn,
    (value: ValueType) => value.username,
    (value: ValueType) => value.uniqueSymbol,
  ]);

  const user = {
    username: "john.doe",
    ssn: "123-45-6789",
    uniqueSymbol: Symbol("John Doe"),
  };
  map.add(user);
  expect(map.get("john.doe")).toEqual(user);
  expect(map.get("123-45-6789")).toEqual(user);
  expect(map.get(user.uniqueSymbol)).toEqual(user);

  user.username = "john.doe.1";
  map.replace("john.doe", user);
  expect(map.get("john.doe")).toEqual(undefined);
  expect(map.get("john.doe.1")).toEqual(user);

  map.deleteByKey("john.doe.1");
  expect(map.get("john.doe.1")).toEqual(undefined);
  expect(map.get("123-45-6789")).toEqual(undefined);
  expect(map.get(user.uniqueSymbol)).toEqual(undefined);
});
