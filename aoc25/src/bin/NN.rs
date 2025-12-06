use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const DAY: &str = "NN"; // TODO: Fill the day
const INPUT_FILE: &str = "input/NN.txt";

const TEST: &str = "
<TEST-INPUT>
"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let answer = reader.lines().flatten().count();
        Ok(answer)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(0, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    //Part 2

    Ok(())
}
