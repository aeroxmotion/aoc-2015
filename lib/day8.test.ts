import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

describe("day1", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(8);
  });

  it("part1", () => {
    let total = 0;

    for (const code of input.split("\n")) {
      total += code.length - eval(code).length;
    }

    expect(total).toBe(1_342);
  });

  it("part2", () => {
    let total = 0;

    for (const code of input.split("\n")) {
      total += JSON.stringify(code).length - code.length;
    }

    expect(total).toBe(2_074);
  });
});
