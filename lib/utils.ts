export async function readInput(day: number): Promise<string> {
  if (!Bun.env.SESSION) {
    throw new Error("Missing env session");
  }

  const response = await fetch(
    `https://adventofcode.com/2015/day/${day}/input`,
    {
      headers: {
        Cookie: `session=${Bun.env.SESSION}`,
      },
    },
  );

  return (await response.text()).trim();
}
