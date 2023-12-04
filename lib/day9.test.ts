import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const PARSE_REGEX = /^(?<from>[a-z]+) to (?<to>[a-z]+) = (?<distance>\d+)$/i;

function day9(input: string, target: "longest" | "smallest") {
  const destinations = new Set<string>();
  const distances: Record<`${string} -> ${string}`, number> = {};

  for (const line of input.split("\n")) {
    const { from, to, distance } = PARSE_REGEX.exec(line)!.groups!;

    destinations.add(from);
    destinations.add(to);

    distances[`${from} -> ${to}`] = distances[`${to} -> ${from}`] =
      parseInt(distance);
  }

  const queue = [...destinations].map((dest) => [dest]);
  const combinations: string[][] = [];

  while (queue.length) {
    const visited = queue.shift()!;

    if (visited.length == destinations.size) {
      combinations.push(visited);
      continue;
    }

    for (const destination of destinations) {
      if (!visited.includes(destination)) {
        queue.push([...visited, destination]);
      }
    }
  }

  let targetDistance = target === "longest" ? -Infinity : Infinity;

  for (const combination of combinations) {
    let destinations = combination.values();
    let prevDestination = destinations.next().value as string;
    let current: IteratorResult<string, any>;
    let distance = 0;

    while (!(current = destinations.next()).done) {
      distance +=
        distances[`${prevDestination} -> ${(prevDestination = current.value)}`];
    }

    targetDistance = (target === "longest" ? Math.max : Math.min)(
      targetDistance,
      distance,
    );
  }

  return targetDistance;
}

describe("day9", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(9);
  });

  it("part1", () => {
    expect(day9(input, "smallest")).toBe(251);
  });

  it("part2", () => {
    expect(day9(input, "longest")).toBe(898);
  });
});
