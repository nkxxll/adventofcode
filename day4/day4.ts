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
function part2(text: string) {}
