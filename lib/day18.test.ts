import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

enum Light {
  On = "#",
  Off = ".",
}

function neighborsOn(grid: Light[][], X: number, Y: number): number {
  let n = 0;

  for (let y = Math.max(0, Y - 1); y <= Math.min(grid.length - 1, Y + 1); y++) {
    for (
      let x = Math.max(0, X - 1);
      x <= Math.min(grid[y].length - 1, X + 1);
      x++
    ) {
      if (x === X && y === Y) {
        continue;
      }

      n += +(grid[y][x] === Light.On);
    }
  }

  return n;
}

function day18(
  grid: Light[][],
  alwaysOn: `${number},${number}`[] = [],
): number {
  let total = 100;
  let lightsOn = 0;

  grid = structuredClone(grid);

  for (const coords of alwaysOn) {
    const [x, y] = coords.split(",");
    grid[+y][+x] = Light.On;
  }

  while (total--) {
    lightsOn = 0;

    const nextGrid = structuredClone(grid);

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (alwaysOn.includes(`${x},${y}`)) {
          lightsOn++;
          continue;
        }

        const n = neighborsOn(grid, x, y);
        const value = (grid[y][x] === Light.On ? [2, 3].includes(n) : n === 3)
          ? Light.On
          : Light.Off;

        nextGrid[y][x] = value;

        if (value == Light.On) {
          lightsOn++;
        }
      }
    }

    grid = nextGrid;
  }

  return lightsOn;
}

describe("day18", () => {
  let grid: Light[][];

  beforeAll(async () => {
    const input = await readInput(18);
    grid = input.split("\n").map((row) => row.split("")) as Light[][];
  });

  it("part1", () => {
    expect(day18(grid)).toBe(1_061);
  });

  it("part2", () => {
    const maxY = grid.length - 1;
    const maxX = grid[maxY].length - 1;

    expect(
      day18(grid, [`0,0`, `${maxX},0`, `${maxX},${maxY}`, `0,${maxY}`]),
    ).toBe(1_006);
  });
});
