import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

interface Ingredient {
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
}

function hasCalories(
  ingredients: Record<string, Ingredient>,
  recipe: [string, number][],
  calories: number,
) {
  return (
    recipe.reduce(
      (acc, [name, percentage]) =>
        acc + ingredients[name].calories * percentage,
      0,
    ) === calories
  );
}

function day15(input: string, calories?: number): number {
  const ingredients: Record<string, Ingredient> = {};

  for (const line of input.split("\n")) {
    const [name, props] = line.split(":");
    const ingredient: any = {};

    for (const prop of props.split(",")) {
      const [n, v] = prop.trim().split(" ");

      ingredient[n] = parseInt(v);
    }

    ingredients[name] = ingredient;
  }

  const visited = new Set<string>();

  const names = Object.keys(ingredients);
  const entry = [names[0], 100] as [string, number];
  const queue: [string, number][][] = [[entry]];
  const props = Object.keys(ingredients[names[0]]).filter(
    (prop) => prop !== "calories",
  ) as Array<keyof Ingredient>;

  for (let i = 1; i < names.length; i++) {
    queue[0].push([names[i], 1]);
    entry[1] -= 1;
  }

  let maxScore = -Infinity;

  while (queue.length) {
    let score = 1;
    const recipe = queue.shift()!;

    for (const prop of props) {
      let propScore = 0;

      for (const [name, percentage] of recipe) {
        propScore += ingredients[name][prop] * percentage;
      }

      score *= Math.max(0, propScore);
    }

    if (recipe[0][1] === 1) {
      continue;
    }

    for (let i = 1; i < recipe.length; i++) {
      const nextRecipe = structuredClone(recipe);

      nextRecipe[i][1] += 1;
      nextRecipe[0][1] -= 1;

      const encodedRecipe = nextRecipe.toString();

      if (!visited.has(encodedRecipe)) {
        queue.push(nextRecipe);
        visited.add(encodedRecipe);
      }
    }

    if (calories == null || hasCalories(ingredients, recipe, calories)) {
      maxScore = Math.max(maxScore, score);
    }
  }

  return maxScore;
}

describe("day15", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(15);
  });

  it("part1", () => {
    expect(day15(input)).toBe(18_965_440);
  });

  it("part2", () => {
    expect(day15(input, 500)).toBe(15_862_900);
  });
});
