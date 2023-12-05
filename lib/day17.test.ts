import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

function day17(input: string, minimum = false): number {
  const offset = "a".charCodeAt(0);
  const containers = input
    .split("\n")
    .map((n, i) => n + String.fromCharCode(offset + i));

  let combinations = 0;
  const sizes: Record<number, number> = {};
  const visited = new Set<string>();
  const queue = containers.map((container) => [container]);

  while (queue.length) {
    const arrangement = queue.shift()!;
    const sum = arrangement.reduce((acc, n) => acc + parseInt(n), 0);

    if (sum > 149) {
      if (sum === 150) {
        if (minimum) {
          sizes[arrangement.length] = (sizes[arrangement.length] || 0) + 1;
        }

        combinations++;
      }

      continue;
    }

    for (const container of containers) {
      if (!arrangement.includes(container)) {
        const next = [...arrangement, container];
        const encodedNext = next
          .slice()
          .sort(
            (a, b) => a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1),
          )
          .toString();

        if (!visited.has(encodedNext)) {
          queue.push(next);
          visited.add(encodedNext);
        }
      }
    }
  }

  return minimum
    ? sizes[Math.min(...Object.keys(sizes).map(Number))]
    : combinations;
}

describe("day17", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(17);
  });

  it("part1", () => {
    expect(day17(input)).toBe(1_304);
  });

  it("part2", () => {
    expect(day17(input, true)).toBe(18);
  });
});
