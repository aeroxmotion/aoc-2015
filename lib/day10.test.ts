import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

function day10(input: string, n: number) {
  let result = input;

  for (let i = 0; i < n; i++) {
    let count = 1;
    let next = "";
    const length = result.length + 1;

    for (let j = 1; j < length; j++) {
      const prev = result[j - 1];

      if (result[j] === prev) {
        count++;
      } else {
        next += count + prev;
        count = 1;
      }
    }

    result = next;
  }

  return result.length;
}

describe("day10", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(10);
  });

  it("part1", () => {
    expect(day10(input, 40)).toBe(492_982);
  });

  it("part2", () => {
    expect(day10(input, 50)).toBe(6_989_950);
  });
});
