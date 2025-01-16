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
    const res1 = part1(textTrimed);
    console.log(res1);
    break;
  case "2":
    const res2 = part2(textTrimed);
    console.log(res2);
    break;
  default:
    console.error("There is only part 1 and 2!");
}

function part1(text: string) {
  const digits: number[] = text.split("").map((x) => parseInt(x));
  const drive = [];
  let res = 0;
  let idx = 0;
  for (let i = 0; i < digits.length; i += 2) {
    drive.push(...new Array(digits[i]).fill(idx));
    drive.push(...new Array(digits[i + 1]).fill(-1));
    idx++;
  }

  //console.log(digits);
  //console.log(drive);

  let free = drive.indexOf(-1);
  let length = drive.length;
  while (free !== -1 && free < length) {
    if (drive[length - 1] === -1) {
      length--;
      continue;
    }
    drive[free] = drive[length - 1];
    length--;
    free = drive.indexOf(-1);
  }

  //console.log(drive);

  for (let i = 0; i < length; i++) {
    if (drive[i] === -1) {
      continue;
    }
    res += i * drive[i];
  }

  return res;
}

function part2(text: string) {
  const digits: number[] = text.split("").map((x) => parseInt(x));
  const drive: number[] = [];
  let res = 0;
  let idx = 0;

  for (let i = 0; i < digits.length; i += 2) {
    drive.push(...new Array(digits[i]).fill(idx));
    drive.push(...new Array(digits[i + 1]).fill(-1));
    idx++;
  }

  let driveIdx = drive.length - 1;
  do {
    let freeIdx = 0;
    while (drive[driveIdx] === -1) {
      driveIdx--;
    }
    const sizeFull = scanFull(driveIdx, drive);
    do {
      while (drive[freeIdx] !== -1) {
        freeIdx++;
      }

      //console.log(freeIdx, driveIdx);

      if (driveIdx <= freeIdx) {
        break;
      }

      const sizeFree = scanFree(freeIdx, drive);

      //console.log(sizeFree, sizeFull);

      if (sizeFree >= sizeFull) {
        //console.log("fits");
        const fileIdx = drive[driveIdx];
        let tempDriveIdx = driveIdx;
        for (let i = freeIdx; i < freeIdx + sizeFull; i++) {
          drive[i] = fileIdx;
          drive[tempDriveIdx] = -1;
          tempDriveIdx--;
        }
        break;
      } else {
        freeIdx += sizeFree;
      }
    } while (driveIdx > freeIdx);
    driveIdx -= sizeFull;
  } while (driveIdx >= 0);

  for (let i = 0; i < drive.length; i++) {
    if (drive[i] === -1) {
      continue;
    }
    res += i * drive[i];
  }

  //console.log(drive);
  return res;
}

function scanFree(free: number, drive: number[]) {
  let current = drive[free];
  let size = 0;
  while (current === -1) {
    size++;
    free++;
    current = drive[free];
  }
  return size;
}

function scanFull(full: number, drive: number[]) {
  const idx = drive[full];
  let current = drive[full];
  let size = 0;
  while (current === idx) {
    size++;
    full--;
    current = drive[full];
  }
  return size;
}
