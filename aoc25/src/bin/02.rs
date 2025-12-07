use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/02.txt";

#[derive(PartialEq)]
enum Part {
    One,
    Two,
}

const TEST: &str = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,\
1698522-1698528,446443-446449,38593856-38593862,565653-565659,\
824824821-824824827,2121212118-2121212124"; // TODO: Add the test input

fn is_nth(number: usize, nth: usize) -> bool {
    let string = number.to_string();
    if string.len() % nth != 0 {
        return false;
    }
    let part_len = string.len() / nth;
    let bytes = string.as_bytes();
    let mut last = &bytes[0..part_len];
    for idx in 1..nth {
        let next = &bytes[idx * part_len..(idx + 1) * part_len];
        if next != last {
            return false;
        }
        last = next;
    }
    true
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn part1<R: BufRead>(mut reader: R) -> Result<usize> {
        Ok(common(&mut reader, Part::One)?)
    }
    fn part2<R: BufRead>(mut reader: R) -> Result<usize> {
        Ok(common(&mut reader, Part::Two)?)
    }
    fn common<R: BufRead>(mut reader: R, part: Part) -> Result<usize> {
        let mut s = String::new();
        reader.read_to_string(&mut s)?;

        let answer = s
            .split(',')
            .map(|x| {
                let (start, end) = x.split_once('-').expect("Invalid range");
                (
                    start
                        .parse::<usize>()
                        .expect("first part of range could not been parsed"),
                    end.parse::<usize>()
                        .expect("second part of range could not been parsed"),
                )
            })
            .fold(0, |acc, (start, end)| match part {
                Part::One => acc + (start..=end).filter(|&i| is_nth(i, 2)).sum::<usize>(),
                Part::Two => {
                    acc + (start..=end)
                        .filter(|&i| is_nth(i, 2) || is_nth(i, 3) || is_nth(i, 5) || is_nth(i, 7))
                        .sum::<usize>()
                }
            });
        Ok(answer)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(1227775554, part1(BufReader::new(TEST.as_bytes()))?);
    assert_eq!(4174379265, part2(BufReader::new(TEST.as_bytes()))?);

    let input_file = BufReader::new(File::open(INPUT_FILE)?);
    let result = part1(input_file)?;
    println!("Result 1 = {}", result);
    //endregion

    let input_file2 = BufReader::new(File::open(INPUT_FILE)?);
    let result2 = part2(input_file2)?;
    println!("Result 2 = {}", result2);

    //Part 2

    Ok(())
}
