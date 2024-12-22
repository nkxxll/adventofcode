const file = Bun.file("input.txt");
const text = await file.text();
const textTrimed = text.trim();
const lines = textTrimed.split("\n");

export const solve = () => {
  const grid = lines.map((line) => line.split(""));

  const antinodes = new Set();
  grid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      const gridOfSameType: string[][] = [];
      grid.forEach((checkRow) => {
        const newRow: string[] = [];
        checkRow.forEach((checkCol) => {
          if (checkCol === col) {
            newRow.push(col);
          } else {
            newRow.push(".");
          }
        });
        gridOfSameType.push(newRow);
      });

      const antennasInLineWithAtLeastOne = new Set();
      gridOfSameType.forEach((compRow, compRowIdx) => {
        compRow.forEach((compCol, compColIdx) => {
          if (
            (compRowIdx === rowIdx && compColIdx === colIdx) ||
            compCol === "."
          )
            return;

          const rowDistance = compRowIdx - rowIdx;
          const colDistance = compColIdx - colIdx;

          // this time i create a step marker since we're going
          // to be crawling the line. one marker for each direction
          let step1 = { row: rowIdx, col: colIdx };
          let step2 = { row: compRowIdx, col: compColIdx };
          let step1OutOfBounds = false;
          let step2OutOfBounds = false;

          // at this point we know we have two antennas that are forming
          // (and therefore on) an antinode line. i check if these antennas
          // have already been a part of an antinode line. if so that
          // means it's on at least two lines, so we count it as an antinode
          if (gridOfSameType[step1.row][step1.col] === col) {
            if (antennasInLineWithAtLeastOne.has(`${step1.row},${step1.col}`)) {
              antinodes.add(`${step1.row},${step1.col}`);
            } else {
              antennasInLineWithAtLeastOne.add(`${step1.row},${step1.col}`);
            }
          }

          if (gridOfSameType[step2.row][step2.col] === col) {
            if (antennasInLineWithAtLeastOne.has(`${step2.row},${step2.col}`)) {
              antinodes.add(`${step2.row},${step2.col}`);
            } else {
              antennasInLineWithAtLeastOne.add(`${step2.row},${step2.col}`);
            }
          }

          // basically extend the check logic from part1, just now we crawl
          // the line until both ends are out of bounds
          while (true) {
            const antinode1 = {
              row: step1.row - rowDistance,
              col: step1.col - colDistance,
            };
            const antinode2 = {
              row: step2.row + rowDistance,
              col: step2.col + colDistance,
            };

            if (
              !step1OutOfBounds &&
              antinode1.row < row.length &&
              antinode1.row >= 0 &&
              antinode1.col < grid.length &&
              antinode1.col >= 0
            ) {
              antinodes.add(`${antinode1.row},${antinode1.col}`);
            } else {
              step1OutOfBounds = true;
            }

            if (
              !step2OutOfBounds &&
              antinode2.row < row.length &&
              antinode2.row >= 0 &&
              antinode2.col < grid.length &&
              antinode2.col >= 0
            ) {
              antinodes.add(`${antinode2.row},${antinode2.col}`);
            } else {
              step2OutOfBounds = true;
            }

            step1 = { row: antinode1.row, col: antinode1.col };
            step2 = { row: antinode2.row, col: antinode2.col };

            if (step1OutOfBounds && step2OutOfBounds) break;
          }
        });
      });
    });
  });
  return antinodes.size;
};

console.log(solve());
