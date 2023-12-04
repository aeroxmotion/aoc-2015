import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

const regexes = [
  /^(\d+|[a-z]+) -> ([a-z]+)$/,
  /^(NOT) (\d+|[a-z]+) -> ([a-z]+)$/,
  /^(\d+|[a-z]+) (AND|OR|(?:L|R)SHIFT) (\d+|[a-z]+) -> ([a-z]+)$/,
];

describe("day7", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(7);
  });

  function day7(bOverride: number | null = null) {
    const scope = {};
    const ops = {
      AND: (left, right) => left() & right(),
      OR: (left, right) => left() | right(),
      LSHIFT: (left, right) => left() << right(),
      RSHIFT: (left, right) => left() >> right(),
    };

    function getGetter(str: string) {
      const n = parseInt(str);
      let cached = null;

      return Number.isNaN(n)
        ? () => {
            if (cached == null) {
              cached = scope[str];
            }

            return cached;
          }
        : () => n;
    }

    for (const line of input.split("\n")) {
      for (const regex of regexes) {
        const match = regex.exec(line);

        if (!match) {
          continue;
        }

        switch (match.length) {
          // <i> -> <i>
          case 3:
            Object.defineProperty(scope, match[2], {
              configurable: true,
              get: getGetter(match[1]),
            });
            break;

          // NOT <i> -> <i>
          case 4:
            const getter = getGetter(match[2]);

            Object.defineProperty(scope, match[3], {
              configurable: true,
              get() {
                return ~getter();
              },
            });
            break;

          // <i> <op> <i> -> <i>
          default:
            const leftGetter = getGetter(match[1]);
            const rightGetter = getGetter(match[3]);
            const op = ops[match[2]];
            const explored = new Set<any>();
            let c = false;

            Object.defineProperty(scope, match[4], {
              configurable: true,
              get() {
                return op(leftGetter, rightGetter);
              },
            });
            break;
        }
      }
    }

    if (bOverride != null) {
      Object.defineProperty(scope, "b", {
        configurable: true,
        get: () => bOverride,
      });
    }

    return scope.a;
  }

  it("part1", () => {
    expect(day7()).toBe(46_065);
  });

  it("part2", () => {
    expect(day7(46_065)).toBe(14_134);
  });
});
