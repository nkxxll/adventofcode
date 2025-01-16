import { forEachChild } from "typescript";
import { parseArgs } from "util";

enum Part {
  ONE,
  TWO,
}

const parseString = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

type Point = {
  x: number;
  y: number;
};

type ParseOut = {
  p: Point;
  v: Point;
};

type Quadrant = 0 | 1 | 2 | 3 | -1;

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
  const lines = text.split("\n");
  const width = 101;
  const height = 103;
  //const width = 11;
  //const height = 7;
  const map = new Array(height).fill([]);
  for (let i = 0; i < height; i++) {
    const wid = new Array(width).fill(0);
    map[i] = wid.slice();
  }
  const quadrants = [0, 0, 0, 0];
  for (let i = 0; i < lines.length; i++) {
    const parseOut = parseLine(lines[i]);
    const after100 = evalSteps(parseOut, 100, width, height);
    map[after100.p.y][after100.p.x] += 1;
    const where: Quadrant = whereIsRobo(after100, width, height);

    //console.log(where);

    if (where === -1) {
      continue;
    }
    quadrants[where] += 1;
  }

  map.forEach((el) => {
    //console.log(el.join(""));
  });

  map.forEach((el: number[], idx: number) => {
    el.forEach((elem: number, idy: number) => {
      map[idx][idy] = whereIsRobo(
        {
          p: { x: idy + 1, y: idx + 1 },
          v: { x: 0, y: 0 },
        },
        width,
        height,
      );
    });
  });

  map.forEach((el) => {
    //console.log(el.join(""));
  });

  let res = quadrants[0];
  //console.log(quadrants);
  for (let i = 1; i < 4; i++) {
    res *= quadrants[i];
  }
  return res;
}

function whereIsRobo(
  after100: ParseOut,
  width: number,
  height: number,
): Quadrant {
  const pos = after100.p;
  if (pos.x < Math.floor(width / 2) && pos.y < Math.floor(height / 2)) {
    return 0;
  }
  if (pos.x > Math.floor(width / 2) && pos.y < Math.floor(height / 2)) {
    return 1;
  }
  if (pos.x < Math.floor(width / 2) && pos.y > Math.floor(height / 2)) {
    return 2;
  }
  if (pos.x > Math.floor(width / 2) && pos.y > Math.floor(height / 2)) {
    return 3;
  }
  return -1;
}

function evalSteps(po: ParseOut, times: number, width: number, height: number) {
  for (let i = 0; i < times; i++) {
    po.p.x = po.p.x + po.v.x;
    po.p.y = po.p.y + po.v.y;

    if (po.p.x < 0) {
      po.p.x = po.p.x + width;
    } else if (po.p.x >= width) {
      po.p.x = po.p.x - width;
    }
    if (po.p.y < 0) {
      po.p.y = po.p.y + height;
    } else if (po.p.y >= height) {
      po.p.y = po.p.y - height;
    }
  }
  return po;
}

function parseLine(line: string): ParseOut {
  const parsed = line.match(parseString)!;
  const parsedInt = parsed.slice(1, 5).map((x) => parseInt(x));
  console.assert(parsed?.length === 5);
  return {
    p: { x: parsedInt[0], y: parsedInt[1] },
    v: { x: parsedInt[2], y: parsedInt[3] },
  };
}
