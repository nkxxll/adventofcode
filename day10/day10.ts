import { parseArgs } from "util";

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
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

let part2!: boolean;
switch (values.part!) {
  case "1":
    const res1 = solution(textTrimed);
    console.log(res1);
    break;
  case "2":
    part2 = true;
    const res2 = solution(textTrimed, part2);
    console.log(res2);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

type Point = {
  x: number;
  y: number;
};

function solution(text: string, part2: boolean = false) {
  let res = 0;
  const heights = text.split("\n").map((x) => x.split(""));
  const starts: Point[] = [];
  for (let i = 0; i < heights.length; i++) {
    for (let j = 0; j < heights[0].length; j++) {
      if (heights[i][j] === "0") {
        starts.push({ x: j, y: i });
      }
    }
  }
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    if (!part2) {
      const seen: boolean[][] = new Array(heights.length);
      for (let i = 0; i < seen.length; i++) {
        seen[i] = new Array(heights[0].length).fill(false);
      }
      res += findEnds(start, seen, heights, 0, part2);
      continue;
    }
    res += findEnds(start, [], heights, 0, part2);
  }
  return res;
}

function findEnds(
  current: Point,
  seen: boolean[][],
  heights: string[][],
  total: number,
  part2: boolean,
): number {
  const currentVal = heights[current.y][current.x];
  if (currentVal === "9") {
    //console.log("total", total, "found 9");
    return total + 1;
  }

  for (let i = 0; i < directions.length; i++) {
    const next = {
      x: current.x + directions[i].x,
      y: current.y + directions[i].y,
    };
    if (
      next.x < 0 ||
      next.y < 0 ||
      next.x >= heights[0].length ||
      next.y >= heights.length
    ) {
      continue;
    }
    if (!part2 && seen[next.y][next.x] === true) {
      continue;
    }
    const nextVal = heights[next.y][next.x];
    if (parseInt(nextVal) - 1 !== parseInt(currentVal)) {
      continue;
    }
    if (!part2) seen[next.y][next.x] = true;
    total = findEnds(next, seen, heights, total, part2);
  }
  return total;
}
