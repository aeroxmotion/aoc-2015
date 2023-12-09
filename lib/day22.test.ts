import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

type PassiveSpell = "shield" | "poison" | "recharge";
type SpellName = PassiveSpell | "missile" | "drain";

interface Spell {
  name: SpellName;
  cost: number;
  turns: number;
  damage?: number;
  heal?: number;
  armor?: number;
  mana?: number;
}

const passives = ["shield", "poison", "recharge"] satisfies PassiveSpell[];

const passiveSpells = {
  shield: {
    name: "shield",
    cost: 113,
    turns: 6,
    armor: 7,
  },
  poison: {
    name: "poison",
    cost: 173,
    turns: 6,
    damage: 3,
  },
  recharge: {
    name: "recharge",
    cost: 229,
    turns: 5,
    mana: 101,
  },
} as const satisfies Record<Exclude<SpellName, "missile" | "drain">, Spell>;

const spells = [
  {
    name: "missile",
    cost: 53,
    turns: 0,
    damage: 4,
    heal: 0,
  },
  {
    name: "drain",
    cost: 73,
    turns: 0,
    damage: 2,
    heal: 2,
  },
  ...Object.values(passiveSpells),
] as const satisfies Spell[];

interface Boss {
  life: number;
  damage: number;
}

interface Player {
  life: number;
  mana: number;

  // Mana spent
  spent: number;

  // Passive spell turns
  shield: number;
  poison: number;
  recharge: number;
}

enum Turn {
  Boss,
  Player,
}

function clone<T>(v: T) {
  return { ...v };
}

function isPassive(spell: Spell) {
  return passives.includes(spell.name as any);
}

function canPrune(player: Player, spell: Spell, min: number) {
  return (
    // Prune branch
    player.spent + spell.cost > min ||
    // Player has active passive skill?
    (player as any)[spell.name] ||
    // Player has enough mana for the spell?
    spell.cost > player.mana
  );
}

let n = 0;

function simulate(
  player: Player,
  boss: Boss,
  turn: Turn,
  spentMin: number,
  hard: boolean,
): number {
  n++;

  const nextPlayer = clone(player);
  const nextBoss = clone(boss);

  if (hard && turn === Turn.Player && !--nextPlayer.life) {
    return spentMin;
  }

  let armor = 0;

  if (nextPlayer.poison) {
    nextBoss.life -= passiveSpells.poison.damage;

    if (nextBoss.life <= 0) {
      return nextPlayer.spent;
    }

    nextPlayer.poison--;
  }

  if (nextPlayer.shield) {
    armor = passiveSpells.shield.armor;
    nextPlayer.shield--;
  }

  if (nextPlayer.recharge) {
    nextPlayer.mana += passiveSpells.recharge.mana;
    nextPlayer.recharge--;
  }

  if (turn === Turn.Boss) {
    nextPlayer.life -= Math.max(nextBoss.damage - armor, 1);

    return nextPlayer.life <= 0
      ? Infinity // In case we lost
      : simulate(nextPlayer, nextBoss, Turn.Player, spentMin, hard);
  }

  let min = spentMin;

  for (const spell of spells) {
    let deepBoss = nextBoss;

    if (canPrune(nextPlayer, spell, min)) {
      continue;
    }

    const deepPlayer = clone(nextPlayer);

    // Update mana things
    deepPlayer.mana -= spell.cost;
    deepPlayer.spent += spell.cost;

    if (isPassive(spell)) {
      (deepPlayer as any)[spell.name] = spell.turns;
    } else {
      deepBoss = clone(nextBoss);
      deepBoss.life -= (spell as any).damage;
      deepPlayer.life += (spell as any).heal;

      if (deepBoss.life <= 0) {
        min = Math.min(min, deepPlayer.spent);
        // If we win, we can prune this branch as well
        continue;
      }
    }

    min = Math.min(min, simulate(deepPlayer, deepBoss, Turn.Boss, min, hard));
  }

  return min;
}

function day22(input: string, hard = false): number {
  const boss: Boss = {} as any;

  for (const line of input.split("\n")) {
    const [k, v] = line.split(":");

    boss[k === "Hit Points" ? "life" : "damage"] = parseInt(v);
  }

  return simulate(
    {
      life: 50,
      mana: 500,
      spent: 0,
      shield: 0,
      poison: 0,
      recharge: 0,
    },
    boss,
    Turn.Player,
    Infinity,
    hard,
  );
}

describe("day22", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(22);
  });

  it("part1", () => {
    expect(day22(input)).toBe(900);
  });

  it("part2", () => {
    expect(day22(input, true)).toBe(1_216);
  });
});
