import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const MAX = "z".charCodeAt(0);
const FORBIDDEN = ["i", "o", "l"].map((s) => s.charCodeAt(0));

function increment(input: string) {
  let i = input.length;
  const result = input.split("");

  while (i--) {
    let next = input.charCodeAt(i) + 1;

    if (next <= MAX) {
      result[i] = String.fromCharCode(next + +FORBIDDEN.includes(next));
      break;
    }

    result[i] = "a";
  }

  return result.join("");
}

function hasIncreasing(input: string) {
  for (let i = 0; i < input.length - 3; i++) {
    const code = input.charCodeAt(i);

    if (
      code === input.charCodeAt(i + 1) - 1 &&
      code === input.charCodeAt(i + 2) - 2
    ) {
      return true;
    }
  }

  return false;
}

function hasDifferentPairs(input: string) {
  const regex = /([a-z])\1/g;
  const match = input.match(regex);

  return !!match && match.length === 2 && match[0] != match[1];
}

function day11(input: string) {
  let target = input;

  do {
    target = increment(target);
  } while (!hasIncreasing(target) || !hasDifferentPairs(target));

  return target;
}

describe("day11", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(11);
  });

  it("part1", () => {
    expect(day11(input)).toBe("cqjxxyzz");
  });

  it("part2", () => {
    expect(day11(day11(input))).toBe("cqkaabcc");
  });
});
