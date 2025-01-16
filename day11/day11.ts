import { parseArgs } from "util";

let PART2 = true;
const BLINKS: number = PART2 ? 75 : 25;
// const BLINKS: number = 3;
console.log("blinks", BLINKS, "part2?", PART2);

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
let stones: number[] = textTrimed.split(" ").map((x) => parseInt(x));

switch (values.part!) {
  case "1":
    const res1 = solution();
    console.log(res1);
    break;
  case "2":
    const res2 = solution2(textTrimed);
    console.log(res2);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function solution() {
  for (let i = 0; i < BLINKS; i++) {
    stones = stones.flatMap(process);
    //console.log(stones);
  }
  return stones.length;
}

function solution2(text: string) {}

function process(stone: number) {
  if (stone === 0) {
    return 1;
  }
  const stoneLength = Math.floor(Math.log10(stone)) + 1;
  if (stoneLength % 2 === 0) {
    const middle = stoneLength / 2;
    const lower = stone % 10 ** middle;
    return [lower, (stone - lower) / 10 ** middle];
  }
  return stone * 2024;
}
