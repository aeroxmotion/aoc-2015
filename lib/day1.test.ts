import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

function part1(input: string): number {
  let floor = 0;

  for (const char of input) {
    floor += char === "(" ? 1 : -1;
  }

  return floor;
}

function part2(input: string): number {
  let floor = 0;
  let i = 0;

  for (const char of input) {
    floor += char === "(" ? 1 : -1;
    i++;

    if (floor == -1) {
      return i;
    }
  }

  return floor;
}

describe("day1", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(1);
  });

  it("part1", () => {
    expect(part1(input)).toBe(232);
  });

  it("part2", () => {
    expect(part2(input)).toBe(1_783);
  });
});
