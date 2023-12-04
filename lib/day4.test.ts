import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

describe("day4", () => {
  let input: string;

  beforeAll(async () => {
    input = (await readInput(4)).trim();
  });

  it("part1", () => {
    // let i = 1 -- Below optimized to avoid interruptions
    let i = 345_000;

    while (true) {
      const hasher = new Bun.CryptoHasher("md5");
      const result = hasher.update(`${input}${i}`).digest("hex");

      if (result.startsWith("00000")) {
        break;
      }

      i++;
    }

    expect(i).toBe(346_386);
  });

  it("part2", () => {
    // let i = 1 -- Below optimized to avoid interruptions
    let i = 9_960_000;

    while (true) {
      const hasher = new Bun.CryptoHasher("md5");
      const result = hasher.update(`${input}${i}`).digest("hex");

      if (result.startsWith("000000")) {
        break;
      }

      i--;
    }

    expect(i).toBe(9_958_218);
  });
});
