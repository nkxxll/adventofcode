import { parseArgs } from "util";

enum Part {
  ONE,
  TWO,
}

type Point = {
  x: number;
  y: number;
};

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    part: {
      type: "string",
      default: "1",
    },
    input: {
      type: "string",
      default: "./input.txt",
    },
  },
  strict: true,
  allowPositionals: true,
});

const file = Bun.file(values.input!);
const text = await file.text();
const textTrimed = text.trim();
const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

switch (values.part!) {
  case "1":
    const res1 = solution(textTrimed, Part.ONE);
    console.log(res1);
    break;
  case "2":
    const res2 = solution(textTrimed, Part.TWO);
    console.log(res2);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function solution(text: string, part: Part) {
  let res = 0;
  const tiles: string[][] = text.split("\n").map((x) => x.split(""));
  const seen = new Array(tiles.length);
  for (let i = 0; i < seen.length; i++) {
    seen[i] = new Array(tiles[i].length).fill(false);
  }

  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[i].length; j++) {
      if (seen[i][j]) {
        continue;
      }
      const current = { x: j, y: i };
      const [area, perimeter] = recWalkRegion(current, seen, tiles, 0, 0);
      console.log(area, perimeter);
      res += area * perimeter;
    }
  }
  console.log(seen);
  return res;
}

function recWalkRegion(
  current: Point,
  seen: boolean[][],
  map: string[][],
  area: number,
  perimeter: number,
): [number, number] {
  // increase area
  area++;
  perimeter += calcPerimeter(current, map);
  seen[current.y][current.x] = true;

  // walk all directions
  for (let i = 0; i < directions.length; i++) {
    const d = directions[i];
    const next = { x: current.x + d.x, y: current.y + d.y };
    if (!inMap(next, map)) {
      continue;
    }
    if (seen[next.y][next.x]) {
      continue;
    }
    if (map[next.y][next.x] === map[current.y][current.x]) {
      [area, perimeter] = recWalkRegion(next, seen, map, area, perimeter);
    }
  }
  return [area, perimeter];
}

function calcPerimeter(current: Point, map: string[][]): number {
  const color = map[current.y][current.x];
  let per = 0;
  directions.forEach((d) => {
    const next = { x: current.x + d.x, y: current.y + d.y };
    if (!inMap(next, map) || map[next.y][next.x] !== color) {
      per++;
    }
  });
  return per;
}

function calcSides(current: Point, map: string[][], shape: Point[]): number {
  let res = 0;

  const start = shape.sort((a, b) => a.y - b.y)[0];
  let cur = start;
  console.log(start);

  let directionIdx = 0;
  // make sure the first step is not on the same tile

  do {
    // check right
    // if right go right set right to right --
    // if not right then go one forward if forward is there else set forward to forward++ is left
    // count res up every time forward changes
  } while (cur !== start);

  return res;
}

function inMap(current: Point, map: string[][]): boolean {
  if (
    current.x < 0 ||
    current.y < 0 ||
    current.x >= map[0].length ||
    current.y >= map.length
  ) {
    return false;
  }
  return true;
}
