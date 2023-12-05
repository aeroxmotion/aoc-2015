import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const PARSE_REGEX =
  /^(?<name>[a-z]+) can fly (?<velocity>\d+) km\/s for (?<duration>\d+) seconds, but then must rest for (?<rest>\d+) seconds\.$/i;

class Reindeer {
  flying = true;
  distance = 0;
  timer = 0;

  name!: string;
  velocity!: number;

  duration!: number;
  rest!: number;

  static parse(str: string) {
    const { name, velocity, duration, rest } = PARSE_REGEX.exec(str)!.groups!;

    return new Reindeer({
      name,
      velocity: parseInt(velocity),
      duration: parseInt(duration),
      rest: parseInt(rest),
    });
  }

  constructor(input: {
    name: string;
    velocity: number;
    duration: number;
    rest: number;
  }) {
    Object.assign(this, input);
  }

  fly() {
    if (this.timer === this[this.flying ? "duration" : "rest"]) {
      this.timer = 0;
      this.flying = !this.flying;
    }

    if (this.flying) {
      this.distance += this.velocity;
    }

    this.timer++;
  }
}

describe("day14", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(14);
  });

  it("part1", () => {
    let maxDistance = -Infinity;

    for (const line of input.split("\n")) {
      let total = 2503;
      const reindeer = Reindeer.parse(line);

      while (total--) {
        reindeer.fly();
      }

      maxDistance = Math.max(maxDistance, reindeer.distance);
    }

    expect(maxDistance).toBe(2_660);
  });

  it("part2", () => {
    const reindeers = input.split("\n").map(Reindeer.parse);
    const points: Record<string, number> = {};

    let total = 2503;
    let maxPoints = 0;

    while (total--) {
      for (const reindeer of reindeers) {
        reindeer.fly();
      }

      let winningReindeers = [reindeers[0]];

      for (let i = 1; i < reindeers.length; i++) {
        const reindeer = reindeers[i];

        if (winningReindeers[0].distance < reindeer.distance) {
          winningReindeers = [reindeer];
        } else if (winningReindeers[0].distance === reindeer.distance) {
          winningReindeers.push(reindeer);
        }
      }

      for (const winningReindeer of winningReindeers) {
        points[winningReindeer.name] = (points[winningReindeer.name] || 0) + 1;
        maxPoints = Math.max(maxPoints, points[winningReindeer.name]);
      }
    }

    expect(maxPoints).toBe(1_256);
  });
});
