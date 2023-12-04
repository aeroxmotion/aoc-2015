import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

describe("day5", () => {
  let input: string;

  beforeAll(async () => {
    input = (await readInput(5)).trim();
  });

  it("part1", () => {
    let nice = 0;
    const rules = [/([a-z])\1/, /[aeiou].*[aeiou].*[aeiou]/];

    for (const str of input.trim().split("\n")) {
      // Avoid invalids
      if (!/(ab|cd|pq|xy)/.test(str)) {
        nice += +rules.every((rule) => rule.test(str));
      }
    }

    expect(nice).toBe(236);
  });

  it("part2", () => {
    let nice = 0;
    const rules = [/([a-z][a-z]).*\1/, /([a-z])[a-z]\1/];

    for (const str of input.trim().split("\n")) {
      nice += +rules.every((rule) => rule.test(str));
    }

    expect(nice).toBe(51);
  });
});
