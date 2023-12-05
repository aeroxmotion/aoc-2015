import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

describe("day19", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(19);
  });

  it("part1", () => {
    const transformed = new Set<string>();
    const productions: Record<string, string[]> = {};
    const [t, molecule] = input.split("\n\n");

    for (const _t of t.split("\n")) {
      const [v, r] = _t.split(" => ");

      (productions[v] || (productions[v] = [])).push(r);
    }

    for (const _molecule in productions) {
      for (const result of productions[_molecule]) {
        let startIndex = 0;

        while (true) {
          const index = molecule.indexOf(_molecule, startIndex);

          if (index === -1) {
            break;
          }

          transformed.add(
            molecule.slice(0, index) +
              result +
              molecule.slice((startIndex = index + _molecule.length)),
          );
        }
      }
    }

    expect(transformed.size).toBe(518);
  });

  it("part2", () => {
    const productions: Record<string, string> = {};
    let [t, molecule] = input.split("\n\n");

    for (const _t of t.split("\n")) {
      const [v, r] = _t.split(" => ");

      productions[r] = v;
    }

    let steps = 0;

    root: while (true) {
      for (const production in productions) {
        // Apply reduction
        const reduced = molecule.replace(production, productions[production]);

        if (reduced === "e") {
          steps++;
          break root;
        }

        if (reduced !== molecule) {
          steps++;
          molecule = reduced;
        }
      }
    }

    expect(steps).toBe(200);
  });
});
