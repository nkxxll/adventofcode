use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const DAY: &str = "01"; // TODO: Fill the day
const INPUT_FILE: &str = "input/01.txt";

#[derive(PartialEq)]
enum Part {
    One,
    Two,
}

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

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn main() -> Result<()> {
    println!("=== Day {DAY} Part 1 ===");

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        Ok(common(reader, Part::Two)?)
    }

    fn common<R: BufRead>(reader: R, part: Part) -> Result<usize> {
        let mut acc = 50;
        let mut sum = 0;

        for line in reader.lines().flatten() {
            let dir = line.as_bytes()[0] as char;
            let n: i32 = line[1..].parse().expect("Failed to parse number");

            match dir {
                'L' => {
                    if part == Part::Two {
                        if acc == 0 {
                            sum -= 1;
                        }
                    }
                    acc -= n;
                    while acc < 0 {
                        acc += 100;
                        if part == Part::Two {
                            sum += 1;
                        }
                    }
                    if acc == 0 {
                        sum += 1;
                    }
                }
                'R' => {
                    acc += n;
                    while acc > 99 {
                        acc -= 100;
                        if part == Part::Two {
                            sum += 1;
                        }
                    }
                    if part == Part::One {
                        if acc == 0 {
                            sum += 1;
                        }
                    }
                }
                _ => panic!("Invalid direction"),
            }
        }
        Ok(sum)
    }

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        Ok(common(reader, Part::One)?)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(3, part1(BufReader::new(TEST.as_bytes()))?);
    let result = run(part1)?;
    println!("Result = {}", result);

    println!("=== Day {DAY} Part 2 ===");
    assert_eq!(6, part2(BufReader::new(TEST.as_bytes()))?);
    let result2 = run(part2)?;
    println!("Result = {}", result2);

    Ok(())
}
