import { parseArgs } from "util";

type Parts = {
  ONE;
  TWO;
};

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
    solve(textTrimed, Parts.ONE);
    break;
  case "2":
    solve(textTrimed);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function solve(text: string, part: Parts) {}
