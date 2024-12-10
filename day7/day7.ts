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
const makePermutations = makePermutationsClosure();

type Line = {
  result: number;
  numbers: number[];
  permutations: string[];
};

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
  const split = text.split("\n");
  let totalRes = 0;
  for (let i = 0; i < split.length; i++) {
    const line = parseLine(split[i]);
    for (let j = 0; j < line.permutations.length; j++) {
      const permut = line.permutations[j];
      let res = line.numbers[0];
      for (let k = 0; k < permut.length; k++) {
        if (permut[k] === "0") {
          res += line.numbers[k + 1];
        } else {
          res *= line.numbers[k + 1];
        }
      }
      if (res === line.result) {
        totalRes += line.result;
      }
    }
  }
  return totalRes;
}

function parseLine(line: string): Line {
  let [result, rest] = line.split(":");
  let numbers = rest.split(" ").map((x) => {
    return parseInt(x);
  });
  return {
    result: parseInt(result),
    numbers: numbers,
    permutations: makePermutations(numbers.length),
  };
}

function makePermutationsClosure() {
  const cache = new Map<number, string[]>();
  function makePermutations(length: number) {
    if (cache.has(length)) {
      return cache.get(length)!;
    }
    let results = [];
    for (let i = 0; i < (length - 1) ** 2; i++) {
      results.push(i.toString(2).padStart(length - 1, "0"));
    }
    console.log(results);
    cache.set(length, results);
    return results;
  }
  return makePermutations;
}

function part2(text: string) {}
