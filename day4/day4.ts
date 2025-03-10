import { parseArgs } from "util";
const XMAS = /XMAS/g;
const SAMX = /SAMX/g;

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
    break;
  case "2":
    part2(textTrimed);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function part1(text: string) {
  let res = 0;
  const split = text.split("\n");
  const horizon = [];
  const diagonalsTopleftDownright = [];
  const diagonalsToprightDownleft = [];
  console.assert(split.length === split[0].length);
  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < split[i].length; j++) {
      if (i === 0) {
        horizon.push(split[i][j]);
        continue;
      }
      horizon[j] += split[i][j];
    }
  }

  // diagonals
  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < split[0].length; j++) {
      if (diagonalsTopleftDownright.length <= i + j) {
        diagonalsTopleftDownright.push(split[i][j]);
        continue;
      }
      diagonalsTopleftDownright[i + j] += split[i][j];
    }
  }

  // diagonals
  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < split[0].length; j++) {
      if (diagonalsToprightDownleft.length <= i + j) {
        diagonalsToprightDownleft.push(split[i][split[0].length - j - 1]);
        continue;
      }
      diagonalsToprightDownleft[i + j] += split[i][split[0].length - j - 1];
    }
  }

  res += getCount(split);
  res += getCount(horizon);
  res += getCount(diagonalsTopleftDownright);
  res += getCount(diagonalsToprightDownleft);
  console.log(res);
}

function getCount(row: string[]) {
  let res = 0;
  for (let i = 0; i < row.length; i++) {
    const xmasMatches = row[i].match(XMAS);
    const samxMatches = row[i].match(SAMX);
    res += xmasMatches?.length || 0;
    res += samxMatches?.length || 0;
  }
  return res;
}

function part2(text: string) {
  let res = 0;
  const split = text.split("\n");

  for (let i = 1; i < split.length - 1; i++) {
    for (let j = 1; j < split[0].length; j++) {
      if (isX(split, i, j)) {
        res += 1;
      }
    }
  }
  console.log(res);
}

function isX(text: string[], i: number, j: number) {
  if (text[i][j] !== "A") {
    return false;
  }
  const upperLeft = text[i - 1][j - 1];
  const upperRight = text[i - 1][j + 1];
  const lowerLeft = text[i + 1][j - 1];
  const lowerRight = text[i + 1][j + 1];

  if (
    upperLeft === "M" &&
    upperRight === "M" &&
    lowerLeft === "S" &&
    lowerRight === "S"
  ) {
    return true;
  }
  if (
    upperLeft === "M" &&
    upperRight === "S" &&
    lowerLeft === "M" &&
    lowerRight === "S"
  ) {
    return true;
  }
  if (
    upperLeft === "S" &&
    lowerLeft === "M" &&
    upperRight === "S" &&
    lowerRight === "M"
  ) {
    return true;
  }
  if (
    upperLeft === "S" &&
    lowerLeft === "S" &&
    upperRight === "M" &&
    lowerRight === "M"
  ) {
    return true;
  }
  return false;
}
