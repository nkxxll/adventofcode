use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/03.txt";

enum Part {
    One,
    Two,
}

const TEST: &str = "987654321111111
811111111111119
234234234234278
818181911112111"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn get_biggest_number_from_string(line: &str, digits: usize) -> usize {
    let mut result = 0;
    let mut remaining = line;

    for idx in 0..digits {
        let min_remaining = digits - idx;
        let search_window = &remaining[..remaining.len() - min_remaining + 1];

        let mut max_index = 0;
        let mut max_digit = '0';

        for (i, ch) in search_window.chars().enumerate() {
            if ch > max_digit {
                max_digit = ch;
                max_index = i;
            }
        }

        result = result * 10 + (max_digit.to_digit(10).unwrap() as usize);
        remaining = &remaining[max_index + 1..];
    }

    result
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        let answer = reader.lines().flatten().fold(0, |acc, l| {
            let number = get_biggest_number_from_string(&l, 2);
            acc + number
        });
        Ok(answer)
    }

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        let answer = reader.lines().flatten().fold(0, |acc, l| {
            let number = get_biggest_number_from_string(&l, 12);
            acc + number
        });
        Ok(answer)
    }

    // TODO: Set the expected answer for the test input
    let res1 = run(part1)?;
    println!("Result = {}", res1);

    assert_eq!(3121910778619, part2(BufReader::new(TEST.as_bytes()))?);

    let res2 = run(part2)?;
    println!("Result = {}", res2);

    assert_eq!(17166, res1);
    assert_eq!(169077317650774, res2);

    //Part 2

    Ok(())
}
