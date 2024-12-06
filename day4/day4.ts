import { parseArgs } from "util";
const XMAS = /(XMAS|SAMX)/g;

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
  for (let i = 0; i < split.length; i++) {
    const line = split[i];
    const matches = line.match(XMAS);
    res += (matches || []).length;
  }

  for (let i = 0; i < split.length; i++) {
    for (let j = 0; j < split[i].length; j++) {
      if (i === 0) {
        horizon.push(split[i][j]);
        continue;
      }
      horizon[j] += split[i][j];
    }
  }

  for (let i = 0; i < horizon.length; i++) {
    const line = horizon[i];
    const matches = line.match(XMAS);
    res += (matches || []).length;
  }
  console.log(res);
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
