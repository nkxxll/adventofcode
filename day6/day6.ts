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

const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

switch (values.part!) {
  case "1":
    const res = part1(textTrimed);
    console.log(res);
    break;
  case "2":
    part2(textTrimed);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function part1(text: string) {
  const split = text.split("\n").map((x) => x.split(""));
  let me: { x: number; y: number } = { x: -1, y: -1 };
  let res = 0;
  let dir = 0;
  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < split[0].length; j++) {
      if (split[i][j] === "^") {
        me = { y: i, x: j };
        continue;
      }
    }
  }
  while (true) {
    if (
      me.x < 0 ||
      me.y < 0 ||
      me.y >= split.length ||
      me.x >= split[0].length
    ) {
      console.log(split.map((x) => x.join()).join("\n"));
      return res;
    }
    if (split[me.y][me.x] !== "X") {
      res++;
    }
    const x = me.x + dirs[dir].x;
    const y = me.y + dirs[dir].y;
    if (x < 0 || y < 0 || y >= split.length || x >= split[0].length) {
      console.log(split.map((x) => x.join()).join("\n"));
      return res;
    }
    if (split[y][x] === "#") {
      dir = (dir + 1) % 4;
      split[me.y][me.x] = "X";
      me.x = me.x + dirs[dir].x;
      me.y = me.y + dirs[dir].y;
      continue;
    }
    split[me.y][me.x] = "X";
    me.x = me.x + dirs[dir].x;
    me.y = me.y + dirs[dir].y;
  }
}

function part2(text: string) {}
