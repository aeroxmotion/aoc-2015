import { beforeAll, describe, it, expect } from "bun:test";

import { readInput } from "./utils";

type Register = "a" | "b";
type Instruction = keyof InstructionSet;
type Instructions = Array<
  { [I in Instruction]: [I, ...InstructionSet[I]] }[Instruction]
>;

interface InstructionSet {
  hlf: [Register];
  tpl: [Register];
  inc: [Register];
  jmp: [number];
  jie: [Register, number];
  jio: [Register, number];
}

const PARSE_REGEX = /^(?<ins>[a-z]+)\s(?<args>.+)$/;

function parse(input: string): Instructions {
  const result: Instructions = [];

  for (const line of input.split("\n")) {
    const { ins, args } = PARSE_REGEX.exec(line)!.groups!;

    result.push([
      ins,
      ...args
        .split(", ")
        .map((arg, _, __, n = parseInt(arg)) => (n !== n ? arg : n)),
    ] as any);
  }

  return result;
}

function day23(input: string, a = 0) {
  const instructions = parse(input);
  const registers: Record<Register, number> = {
    a,
    b: 0,
  };

  let i = 0;

  while (i < instructions.length) {
    const ins = instructions[i];

    switch (ins[0]) {
      case "hlf":
        registers[ins[1]] /= 2;
        i++;
        break;

      case "tpl":
        registers[ins[1]] *= 3;
        i++;
        break;

      case "inc":
        registers[ins[1]]++;
        i++;
        break;

      case "jmp":
        i += ins[1];
        break;

      case "jie":
        if (registers[ins[1]] % 2 === 0) {
          i += ins[2];
        } else {
          i++;
        }
        break;

      case "jio":
        if (registers[ins[1]] === 1) {
          i += ins[2];
        } else {
          i++;
        }
        break;
    }
  }

  return registers.b;
}

describe("day23", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(23);
  });

  it("part1", () => {
    expect(day23(input)).toBe(170);
  });

  it("part1", () => {
    expect(day23(input, 1)).toBe(247);
  });
});
