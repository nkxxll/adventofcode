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

function part1(textTrimed: string) {
  let res = 0;
  const split = textTrimed.split("\n\n");
  const rules = split[0].split("\n");
  const pages = split[1].split("\n");
  const ruleMap = new Map<number, number[]>();

  for (let i = 0; i < rules.length; i++) {
    const { first, second } = parseRuleLine(rules[i]);
    if (!ruleMap.has(first)) {
      ruleMap.set(first, [second]);
    } else {
      ruleMap.set(first, [second, ...ruleMap.get(first)!]);
    }
  }

  for (let i = 0; i < pages.length; i++) {
    const page = parsePageLine(pages[i]);
    for (let j = 0; j < page.length; j++) {
      // check whether one of the rule pages is in front and breaks the rule
      const rule = ruleMap.get(page[j]);
      if (rule && !isRight(page.slice(0, j), rule)) {
        break;
      }
      if (j === page.length - 1) {
        res += page[Math.floor(page.length / 2)];
      }
    }
  }
  console.log(res);
}

function part2(textTrimed: string) {
  throw new Error("Function not implemented.");
}

function parseRuleLine(arg0: string): { first: any; second: any } {
  const split = arg0.split("|");
  const first = parseInt(split[0]);
  const second = parseInt(split[1]);
  return { first: first, second: second };
}

function parsePageLine(arg0: string) {
  return arg0.split(",").map((x) => parseInt(x));
}

function isRight(pages: number[], rules: number[]) {
  for (let i = 0; i < rules.length; i++) {
    if (pages.indexOf(rules[i]) !== -1) {
      return false;
    }
  }
  return true;
}
