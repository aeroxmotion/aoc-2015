import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

describe("day2", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(2);
  });

  it("part1", () => {
    let sum = 0;

    for (const line of input.trim().split("\n")) {
      let min = Infinity;
      let area = 0;
      let sizes = line.split("x").map(Number);

      for (let i = 0; i < sizes.length; i++) {
        for (let j = i + 1; j < sizes.length; j++) {
          let n = sizes[i] * sizes[j];
          area += 2 * n;
          min = Math.min(min, n);
        }
      }

      sum += min + area;
    }

    expect(sum).toBe(1_598_415);
  });

  it("part2", () => {
    let sum = 0;

    for (const line of input.trim().split("\n")) {
      let sizes = line.split("x").map(Number);
      let per = Infinity;
      let area = 1;

      for (let i = 0; i < sizes.length; i++) {
        area *= sizes[i];

        for (let j = i + 1; j < sizes.length; j++) {
          per = Math.min(per, 2 * sizes[i] + 2 * sizes[j]);
        }
      }

      sum += per + area;
    }

    expect(sum).toBe(3_812_909);
  });
});
