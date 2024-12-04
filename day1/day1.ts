import { parseArgs } from "util";

const { values, positionals } = parseArgs({
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

function part2(text: string) {
  let res = 0;
  const split = text.split("\n");
  const leftRow = [];
  const rightRow = [];

  for (let i = 0; i < split.length; i++) {
    const numbers = split[i].split("   ");
    const a = parseInt(numbers[0]);
    const b = parseInt(numbers[1]);
    leftRow.push(a);
    rightRow.push(b);
  }

  const mapRight: Record<number, number> = {};
  for (let i = 0; i < leftRow.length; i++) {
    mapRight[rightRow[i]] = mapRight[rightRow[i]]
      ? mapRight[rightRow[i]] + 1
      : 1;
  }

  for (let i = 0; i < leftRow.length; i++) {
    const add = leftRow[i] * (mapRight[leftRow[i]] ? mapRight[leftRow[i]] : 0);
    res += add;
  }

  console.log(res);
}

function part1(text: string) {
  let res = 0;

  const split = text.split("\n");
  let leftRow: number[] = [];
  let rightRow: number[] = [];

  for (let i = 0; i < split.length; i++) {
    const numbers = split[i].split("   ");
    const a = parseInt(numbers[0]);
    const b = parseInt(numbers[1]);
    leftRow.push(a);
    rightRow.push(b);
  }
  leftRow.sort();
  rightRow.sort();

  for (let i = 0; i < leftRow.length; i++) {
    res += Math.abs(rightRow[i] - leftRow[i]);
  }

  console.log(res);
}
