import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const GRID_SIZE = 1000;
const PARSE_REGEX = /^(turn o(?:ff|n)|toggle) (\d+),(\d+) through (\d+),(\d+)$/;

type TransformFns = Record<
  "toggle" | `turn o${"n" | "ff"}`,
  Transformer["transform"]
>;

type Range = [start: number, end: number];

interface Transformer {
  transform(value: number): number;
  x: Range;
  y: Range;
}

describe("day6", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(6);
  });

  function day6(fns: TransformFns): number {
    const transformers: Transformer[] = [];

    for (const ins of input.split("\n")) {
      const [, what, xStart, yStart, xEnd, yEnd] = PARSE_REGEX.exec(ins)!;

      transformers.push({
        transform: (fns as any)[what],
        x: [parseInt(xStart), parseInt(xEnd)],
        y: [parseInt(yStart), parseInt(yEnd)],
      });
    }

    let result = 0;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);

      let transformed = 0;

      for (const t of transformers) {
        if (x >= t.x[0] && x <= t.x[1] && y >= t.y[0] && y <= t.y[1]) {
          transformed = t.transform(transformed);
        }
      }

      result += transformed;
    }

    return result;
  }

  it("part1", () => {
    expect(
      day6({
        toggle: (value) => value ^ 1,
        "turn on": () => 1,
        "turn off": () => 0,
      }),
    ).toBe(569_999);
  });

  it("part2", () => {
    expect(
      day6({
        "turn on": (value) => value + 1,
        "turn off": (value) => Math.max(value - 1, 0),
        toggle: (value) => value + 2,
      }),
    ).toBe(17_836_115);
  });
});
