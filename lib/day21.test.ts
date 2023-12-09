import { describe, it, expect, beforeAll } from "bun:test";

import { readInput } from "./utils";

interface Item {
  name: ItemName;
  cost: number;
  damage: number;
  armor: number;
}

type ItemName = string;

class Equipment {
  rings: ItemName[] = [];

  constructor(
    public weapon: ItemName,
    public armor: ItemName,
  ) {}

  __hash__() {
    return [this.weapon, this.armor, ...this.rings.sort()].join(",");
  }

  getDamage() {
    return (
      itemShop.get("weapons", this.weapon).damage + this._computeRings("damage")
    );
  }

  getArmor() {
    return this._computeArmor("armor") + this._computeRings("armor");
  }

  getCost(): number {
    return (
      itemShop.get("weapons", this.weapon).cost +
      this._computeArmor("cost") +
      this._computeRings("cost")
    );
  }

  private _computeArmor(key: "cost" | "armor"): number {
    return itemShop.get("armors", this.armor)[key];
  }

  private _computeRings(key: "cost" | "armor" | "damage"): number {
    return this.rings.reduce(
      (sum, ring) => sum + itemShop.get("rings", ring)[key],
      0,
    );
  }
}

class Player {
  life = 100;

  constructor(public equip: Equipment) {}

  attack(boss: Boss) {
    boss.life -= Math.max(0, this.equip.getDamage() - boss.armor);
  }
}

class Boss {
  constructor(
    public life = 0,
    public damage = 0,
    public armor = 0,
  ) {}

  attack(player: Player) {
    player.life -= Math.max(0, this.damage - player.equip.getArmor());
  }

  clone(): Boss {
    return new Boss(this.life, this.damage, this.armor);
  }
}

const ITEM_SHOP = `
Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armors:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage+1     25     1       0
Damage+2     50     2       0
Damage+3    100     3       0
Defense+1    20     0       1
Defense+2    40     0       2
Defense+3    80     0       3`;

type CategoryItem = "weapons" | "armors" | "rings";

const itemShop = (() => {
  const result: Record<CategoryItem, Record<ItemName, Item>> = {} as any;

  for (const c of ITEM_SHOP.trim().split("\n\n")) {
    const items = c.split("\n");
    const category = (result[
      items[0].split(":")[0].toLowerCase() as keyof typeof result
    ] = {} as Record<ItemName, Item>);

    for (const i of items.slice(1)) {
      const [name, cost, damage, armor] = i.split(/\s+/);

      category[name] = {
        name,
        cost: +cost,
        damage: +damage,
        armor: +armor,
      };
    }
  }

  result.armors["null"] = { name: "null", armor: 0, damage: 0, cost: 0 };

  return {
    category(category: CategoryItem) {
      return result[category];
    },
    get(category: CategoryItem, name: ItemName): Item {
      return this.category(category)[name];
    },
  };
})();

describe("day21", () => {
  let input: string;

  beforeAll(async () => {
    input = await readInput(21);
  });

  it("part1", () => {
    let lessCost = Infinity;
    let mostCost = -Infinity;
    const ogBoss = new Boss();

    for (const line of input.split("\n")) {
      const [k, v] = line.split(":");

      (ogBoss as any)[k === "Hit Points" ? "life" : k.toLowerCase()] =
        parseInt(v);
    }

    const queue: Equipment[] = Object.keys(itemShop.category("weapons")).map(
      (weapon) => new Equipment(weapon, "null"),
    );
    const visited = new Set<string>(...queue.map((e) => e.__hash__()));

    function push(equip: Equipment) {
      if (!visited.has(equip.__hash__())) {
        queue.push(equip);
        visited.add(equip.__hash__());
      }
    }

    while (queue.length) {
      const player = new Player(queue.shift()!);
      const boss = ogBoss.clone();

      let playerTurn = true;

      while (Math.min(player.life, boss.life) > 0) {
        if (playerTurn) {
          player.attack(boss);
        } else {
          boss.attack(player);
        }

        playerTurn = !playerTurn;
      }

      // We win! No need to buy anything more
      if (player.life > boss.life) {
        lessCost = Math.min(lessCost, player.equip.getCost());
        continue;
      }

      mostCost = Math.max(mostCost, player.equip.getCost());

      for (const armor in itemShop.category("armors")) {
        if (armor !== player.equip.armor) {
          push(new Equipment(player.equip.weapon, armor));
        }
      }

      if (player.equip.rings.length < 2) {
        for (const ring in itemShop.category("rings")) {
          if (!player.equip.rings.includes(ring)) {
            const equip = new Equipment(
              player.equip.weapon,
              player.equip.armor,
            );
            equip.rings = [...player.equip.rings, ring];

            push(equip);
          }
        }
      }
    }

    console.log("most cost", mostCost);
    expect(lessCost).toBe(111);
  });

  // it("part2", () => {
  //   expect(part2(input)).toBe(1_783);
  // });
});
