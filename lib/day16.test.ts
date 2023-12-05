import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const TICKER_TAPE = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

type Thing = keyof typeof TICKER_TAPE;

function day16(
  input: string,
  greater: Thing[] = [],
  fewer: Thing[] = [],
): number {
  root: for (const line of input.split("\n")) {
    const index = line.indexOf(":");
    const sue = line.slice(0, index);
    const things = line.slice(index + 1);

    for (const t of things.split(",")) {
      const [thing, value] = t.split(":");
      const _thing = thing.trim() as Thing;
      const _value = TICKER_TAPE[_thing];
      const _target = parseInt(value);

      if (
        greater.includes(_thing)
          ? _target <= _value
          : fewer.includes(_thing)
            ? _target >= _value
            : _value !== _target
      ) {
        continue root;
      }
    }

    return parseInt(sue.match(/\d+$/)![0]);
  }

  return 0;
}

describe("day16", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(16);
  });

  it("part1", () => {
    expect(day16(input)).toBe(373);
  });

  it("part2", () => {
    expect(day16(input, ["cats", "trees"], ["pomeranians", "goldfish"])).toBe(
      260,
    );
  });
});
