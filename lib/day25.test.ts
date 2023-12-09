import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const PARSE_REGEX = /row (?<row>\d+), column (?<col>\d+)/;

function modPow(base: number, exp: number, mod: number) {
  base %= mod;

  let res = 1;

  while (exp) {
    if (exp % 2) {
      res = (res * base) % mod;
    }

    exp >>= 1;
    base = base ** 2 % mod;
  }

  return res;
}

describe("day25", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(25);
  });

  it("part1", () => {
    const { row: r, col: c } = PARSE_REGEX.exec(input)!.groups as any;
    const [row, col] = [r - 1, c - 1];

    const target = row + col;
    const [code, base, mod] = [20_151_125, 252_533, 33_554_393];

    const exp = (target * (target + 1)) / 2 + col;
    const result = (modPow(base, exp, mod) * code) % mod;

    expect(result).toBe(8_997_277);
  });

  // it("part2", () => {
  //   expect(part2(input)).toBe(1_783);
  // });
});
