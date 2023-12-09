import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

type Combination = [number[], number[]];

function sum(nums: number[]) {
  return nums.reduce((sum, n) => sum + n, 0);
}

function day24(input: string, groups = 3) {
  const nums = input.split("\n").map(Number);
  const target = sum(nums) / groups;
  let minLength = Infinity;
  let qe = Infinity;

  const queue: number[][] = [[]];
  const visited: Record<string, 1> = {};

  while (queue.length) {
    const _nums = queue.shift()!;
    const n = sum(_nums);

    if (_nums.length > minLength || n > target) {
      continue;
    }

    if (n === target) {
      minLength = Math.min(minLength, _nums.length);
      qe = Math.min(
        qe,
        _nums.reduce((mul, n) => mul * n, 1),
      );
      continue;
    }

    for (const num of nums) {
      if (_nums.includes(num)) {
        continue;
      }

      const next = [..._nums, num];
      const hash = next.sort().join(",");

      if (!visited[hash]) {
        visited[hash] = 1;
        queue.push(next);
      }
    }
  }

  return qe;
}

describe("day24", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(24);
  });

  it("part1", () => {
    expect(day24(input)).toBe(10_439_961_859);
  });

  it("part2", () => {
    expect(day24(input, 4)).toBe(72_050_269);
  });
});
