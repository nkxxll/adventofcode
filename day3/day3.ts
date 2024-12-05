import { parseArgs } from "util";
const REGEX_MUL_DO = /(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/;
const REGEX_MUL = /mul\(\d{1,3},\d{1,3}\)/g;
const DIGIT = /\d+/g;

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
  const muls = [...text.matchAll(REGEX_MUL)];
  let res = 0;
  for (let i = 0; i < muls.length; i++) {
    const mul = muls[i];
    let { a, b } = parse(mul[0]);
    res += a * b;
  }
  console.log(res);
}

function part2(text: string) {
  let enabled = true;
  let res = 0;
  while (text !== "") {
    const match = text.match(REGEX_MUL_DO);
    if (!match || match.index === undefined) {
      break;
    }
    if (match[0] === "do()") {
      enabled = true;
      text = text.slice(match.index + match[0].length);
    } else if (match[0] === "don't()") {
      enabled = false;
      text = text.slice(match.index! + match[0].length);
    } else {
      if (enabled) {
        const { a, b } = parse(match[0]);
        res += a * b;
      }
      text = text.slice(match.index! + match[0].length);
    }
  }
  console.log(res);
}
function parse(rest: string) {
  const digits = [...rest.matchAll(DIGIT)];
  return { a: parseInt(digits[0][0]), b: parseInt(digits[1][0]) };
}
