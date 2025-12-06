use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const DAY: &str = "01"; // TODO: Fill the day
const INPUT_FILE: &str = "input/01.txt";

const TEST: &str = "L68
L30
R48
L5
R60
L55
L1
L99
R14
L82";

fn main() -> Result<()> {
    println!("=== Day {DAY} Part 1 ===");

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        let mut acc = 50;
        let mut sum = 0;

        for line in reader.lines().flatten() {
            let dir = line.as_bytes()[0] as char;
            let n: i32 = line[1..].parse().expect("Failed to parse number");

            match dir {
                'L' => {
                    acc -= n;
                    while acc < 0 {
                        acc += 100;
                    }
                }
                'R' => {
                    acc += n;
                    while acc > 99 {
                        acc -= 100;
                    }
                }
                _ => panic!("Invalid direction"),
            }
            if acc == 0 {
                sum += 1;
            }
        }
        Ok(sum)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(3, part1(BufReader::new(TEST.as_bytes()))?);

    let input_file = BufReader::new(File::open(INPUT_FILE)?);
    let result = part1(input_file)?;
    println!("Result = {}", result);
    //endregion

    //Part 2

    Ok(())
}
