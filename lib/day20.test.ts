import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

function day20(
  input: string,
  presentMultiplier = 10,
  stopEvery = Infinity,
): number {
  let house = 0;
  const N = parseInt(input);
  const points = new Uint32Array(N);

  root: for (let elf = 2; elf < N; elf++) {
    for (let house = elf - 1; house < N; house += elf) {
      points[house] += elf * presentMultiplier;

      if (house / elf >= stopEvery) {
        break;
      }
    }

    if (points[elf - 1] >= N) {
      house = elf;
      break root;
    }
  }

  return house;
}

describe("day20", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(20);
  });

  it("part1", () => {
    expect(day20(input)).toBe(776_160);
  });

  it("part2", () => {
    expect(day20(input, 11, 50)).toBe(786_240);
  });
});
