import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const PARSE_REGEX =
  /^(?<guest>[a-z]+) would (?<t>gain|lose) (?<happiness>\d+) happiness units by sitting next to (?<neighbor>[a-z]+)\.$/i;

function day13(input: string, addMe: boolean) {
  const guests = new Set<string>();
  const arrangements = new Map<string, number>();

  for (const line of input.split("\n")) {
    const { guest, t, happiness, neighbor } = PARSE_REGEX.exec(line)!.groups!;

    arrangements.set(
      `${guest}${neighbor}`,
      parseInt(happiness) * (t === "gain" ? 1 : -1),
    );

    guests.add(guest);
  }

  if (addMe) {
    for (const guest of guests) {
      arrangements.set(`Me${guest}`, 0).set(`${guest}Me`, 0);
    }

    guests.add("Me");
  }

  let maxHappiness = -Infinity;
  const queue = [...guests].map((guest) => [guest]);

  while (queue.length) {
    const arrangement = queue.shift()!;
    const { length } = arrangement;

    if (length === guests.size) {
      let happiness = 0;

      for (let i = 0; i < length; i++) {
        const h = (i == 0 ? length : i) - 1;
        const j = (i + 1) % length;
        const current = arrangement[i];

        happiness +=
          arrangements.get(`${current}${arrangement[h]}`)! +
          arrangements.get(`${current}${arrangement[j]}`)!;
      }

      maxHappiness = Math.max(maxHappiness, happiness);
      continue;
    }

    for (const guest of guests) {
      if (!arrangement.includes(guest)) {
        queue.push([...arrangement, guest]);
      }
    }
  }

  return maxHappiness;
}

describe("day13", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(13);
  });

  it("part1", () => {
    expect(day13(input, false)).toBe(733);
  });

  it("part2", () => {
    expect(day13(input, true)).toBe(725);
  });
});
