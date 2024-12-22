import { parseArgs } from "util";

let width: number = -1;
let height: number = -1;
let res: number = 0;

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
    part1(textTrimed);
    console.log(res);
    break;
  case "2":
    part2(textTrimed);
    console.log(res);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

interface Point {
  x: number;
  y: number;
}
type CharMap = { [key: string]: Point[] };

function part1(text: string) {
  // bad globals
  const lines = text.split("\n");
  width = lines[0].length;
  height = lines.length;
  let map = parse_input(lines);
  //printMap(map);
  map = createAndCountAntiNodes(map);
  //printMap(map);
}

function part2(text: string) {
  // bad globals
  const lines = text.split("\n");
  width = lines[0].length;
  height = lines.length;
  let map = parse_input(lines);
  findAntinodes(map);
}

function parse_input(lines: string[]): CharMap {
  let result: CharMap = {};
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[0].length; j++) {
      const char = lines[i][j];
      if (char === ".") {
        continue;
      }
      const point = { x: j, y: i };
      if (!result[char]) {
        result[char] = [];
      }
      result[char].push(point);
    }
  }
  return result;
}

function createAndCountAntiNodes2(map: CharMap): CharMap {
  const newmap = Object.assign(map);
  // add the antinode
  const keys = Object.keys(newmap);
  newmap["#"] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const points = newmap[key];
    const points_length = points.length;
    for (let j = 0; j < points_length; j++) {
      for (let k = j + 1; k < points_length; k++) {
        let p1 = points[j];
        let p2 = points[k];
        const dist: Point = { x: p1.x - p2.x, y: p1.y - p2.y };

        // are p1 and p2 also antinodes
        const a1 = { x: p1.x + dist.x, y: p1.y + dist.y };
        const a11 = { x: a1.x + dist.x, y: a1.y + dist.y };
        const a2 = { x: p2.x - dist.x, y: p2.y - dist.y };
        const a22 = { x: a2.x - dist.x, y: a2.y - dist.y };
        if (inMap(a1) && isFreeMap(p2, newmap)) {
          newmap["#"].push(p2);
          res++;
        }
        if (inMap(a2) && isFreeMap(p1, newmap)) {
          newmap["#"].push(p1);
          res++;
        }
        if (inMap(a11) && isFreeMap(p1, newmap)) {
          newmap["#"].push(p1);
          res++;
        }
        if (inMap(a22) && isFreeMap(p2, newmap)) {
          newmap["#"].push(p2);
          res++;
        }

        while (true) {
          const a1 = { x: p1.x + dist.x, y: p1.y + dist.y };
          if (inMap(a1)) {
            if (isFreeMap(a1, newmap)) {
              newmap["#"].push(a1);
              res++;
            }
            p1 = a1;
          } else {
            break;
          }
        }

        while (true) {
          const a2 = { x: p2.x - dist.x, y: p2.y - dist.y };
          if (inMap(a2)) {
            if (isFreeMap(a2, newmap)) {
              newmap["#"].push(a2);
              res++;
            }
            p2 = a2;
          } else {
            break;
          }
        }
      }
    }
  }
  return newmap;
}

function createAndCountAntiNodes(map: CharMap): CharMap {
  const newmap = Object.assign(map);
  // add the antinode
  const keys = Object.keys(newmap);
  newmap["#"] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const points = newmap[key];
    const points_length = points.length;
    for (let j = 0; j < points_length; j++) {
      for (let k = j + 1; k < points_length; k++) {
        //console.log(
        //  `key: ${key}\n point1: ${JSON.stringify(points[j])}\npoint2: ${JSON.stringify(points[k])}`,
        //);

        const p1 = points[j];
        const p2 = points[k];
        const dist: Point = { x: p1.x - p2.x, y: p1.y - p2.y };
        const a1 = { x: p1.x + dist.x, y: p1.y + dist.y };
        const a2 = { x: p2.x - dist.x, y: p2.y - dist.y };

        if (inMap(a1) && isFreeMap(a1, newmap)) {
          newmap["#"].push(a1);
          //console.log(key);
          //console.log(a1);
          res++;
        }

        if (inMap(a2) && isFreeMap(a2, newmap)) {
          newmap["#"].push(a2);
          //console.log(key);
          //console.log(a2);
          res++;
        }
      }
    }
  }
  return newmap;
}

function inMap(point: Point) {
  const x = point.x;
  const y = point.y;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return false;
  }
  return true;
}

function isFreeMap(point: Point, map: CharMap) {
  const points = map["#"];
  for (let j = 0; j < points.length; j++) {
    if (point.x === points[j].x && point.y === points[j].y) {
      return false;
    }
  }
  return true;
}

function printMap(map: CharMap) {
  let chars: string[][] = new Array(height);
  for (let i = 0; i < height; i++) {
    chars[i] = new Array(width).fill(".");
  }
  const keys = Object.keys(map).reverse();

  for (let i = 0; i < keys.length; i++) {
    const points = map[keys[i]];
    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      chars[point.y][point.x] = keys[i];
    }
  }

  chars.forEach((line) => {
    console.log(line.join(""));
  });
}

function findAntinodes(map: CharMap) {
  let antinodes = new Set<Point>();
  const keys = Object.keys(map);
  for (let i = 0; i < keys.length; i++) {
    const points = map[keys[i]];
    for (let j = 0; j < points.length; j++) {
      for (let k = j + 1; k < points.length; k++) {
        const a = points[j];
        const b = points[k];

        findRecAntinodes(a, b, antinodes);
        findRecAntinodes(b, a, antinodes);
      }
    }
  }
  res = antinodes.size;
}

function findRecAntinodes(point: Point, other: Point, antinode: Set<Point>) {
  const newx = other.x + (other.x - point.x);
  const newy = other.y + (other.y - point.y);
  let newPoint: Point = { x: newx, y: newy };
  while (inMap(newPoint)) {
    antinode.add(newPoint);
    newPoint.x += other.x - point.x;
    newPoint.y += other.y - point.y;
  }
}
