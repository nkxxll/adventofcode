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

function part1(text: string) {
  const numbers = parse(text);
  let res = 0;
  for (let i = 0; i < numbers.length; i++) {
    const line = numbers[i];
    let descending = line[0] > line[1] ? true : false;
    const right = lineRight(line, descending);
    if (right) {
      res++;
    }
  }
  console.log(res);
}

function lineRight(line: number[], descending: boolean) {
  for (let j = 1; j < line.length; j++) {
    // all descending or ascending
    if (line[j - 1] <= line[j] && descending) {
      return false;
    } else if (line[j - 1] >= line[j] && !descending) {
      return false;
    }
    const distance = Math.abs(line[j - 1] - line[j]);
    if (distance > 3 || distance < 1) {
      return false;
    }
  }
  return true;
}

function part2(text: string) {
  const numbers = parse(text);
  let res = 0;
  for (let i = 0; i < numbers.length; i++) {
    const line = numbers[i];
    let descending = line[0] > line[1] ? true : false;
    const right = lineRight(line, descending);
    if (right) {
      res++;
    } else {
      for (let j = 0; j < line.length; j++) {
        const newline = line.slice();
        newline.splice(j, 1);
        let descending = newline[0] > newline[1] ? true : false;
        if (lineRight(newline, descending)) {
          res++;
          break;
        }
      }
    }
  }
  console.log(res);
}

function parse(text: string) {
  const res = [];
  const split = text.split("\n");
  for (let i = 0; i < split.length; i++) {
    const numbers: number[] = split[i].split(" ").map((x) => parseInt(x));
    res.push(numbers);
  }
  return res;
}
