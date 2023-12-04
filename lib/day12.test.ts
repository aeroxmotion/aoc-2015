import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

type T = { [K: string]: T | number | string } | (T | number | string)[];

describe("day11", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(12);
  });

  it("part1", () => {
    let sum = 0;

    JSON.parse(input, (_, value) => {
      if (typeof value === "number") {
        sum += value;
      }
    });

    expect(sum).toBe(111_754);
  });

  it("part2", () => {
    function dfs(obj: T) {
      let sum = 0;
      let isObj = !Array.isArray(obj);
      const keys = Object.keys(obj);

      for (const key of keys) {
        const value = (obj as any)[key];

        if (value === "red" && isObj) {
          return 0;
        }

        switch (typeof value) {
          case "number":
            sum += value;
            break;

          case "object":
            if (value) {
              sum += dfs(value);
            }
            break;
        }
      }

      return sum;
    }

    expect(dfs(JSON.parse(input))).toBe(65_402);
  });
});
