import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const DELTAS: Record<string, [number, number]> = {
  "^": [0, -1],
  ">": [1, 0],
  "<": [-1, 0],
  v: [0, 1],
};

describe("day3", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(3);
  });

  it("part1", () => {
    const pos = [0, 0];
    const explored = new Set([pos.join()]);

    for (const ins of input) {
      const [i, j] = DELTAS[ins];
      pos[0] += i;
      pos[1] += j;
      explored.add(pos.join());
    }

    expect(explored.size).toBe(2_592);
  });

  it("part2", () => {
    const santa = [0, 0];
    const roboSanta = [...santa];
    const explored = new Set([santa.join()]);
    let pos = santa;

    for (const ins of input) {
      const [i, j] = DELTAS[ins];
      pos[0] += i;
      pos[1] += j;

      pos = pos == santa ? roboSanta : santa;
      explored.add(pos.join());
    }

    expect(explored.size).toBe(2_360);
  });
});
