use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/05.txt";

enum Part {
    One,
    Two,
}

const TEST: &str = "3-5
10-14
16-20
12-18

1
5
8
11
17
32"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn in_ranges(id: usize, parsed_ranges: &Vec<(usize, usize)>) -> bool {
    for (start, end) in parsed_ranges {
        if id >= *start && id <= *end {
            return true;
        }
    }
    false
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn part2<R: BufRead>(mut reader: R) -> Result<usize> {
        // TODO: Solve Part 2 of the puzzle
        let mut buf = String::new();
        _ = reader.read_to_string(&mut buf);
        let (ranges, _) = buf.split_once("\n\n").expect("could not split");
        let mut parsed_ranges = ranges
            .lines()
            .map(|x| {
                let (start, end) = x.split_once("-").expect("could not split");
                (
                    start
                        .parse::<usize>()
                        .expect("could not parse start to int"),
                    end.parse::<usize>().expect("could not parse end to int"),
                )
            })
            .collect::<Vec<_>>();

        // Sort ranges by start position
        parsed_ranges.sort_by_key(|(start, _)| *start);

        // Merge overlapping ranges
        let mut merged: Vec<(usize, usize)> = Vec::new();
        for (start, end) in parsed_ranges {
            if let Some(last) = merged.last_mut() {
                if start <= last.1 {
                    last.1 = std::cmp::max(last.1, end);
                } else {
                    merged.push((start, end));
                }
            } else {
                merged.push((start, end));
            }
        }

        let mut sum = 0;
        for range in merged {
            sum += range.1 - range.0 + 1;
        }

        Ok(sum)
    }

    fn part1<R: BufRead>(mut reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let mut buf = String::new();
        _ = reader.read_to_string(&mut buf);
        let (ranges, ids) = buf.split_once("\n\n").expect("could not split");
        let parsed_ranges = ranges
            .lines()
            .map(|x| {
                let (start, end) = x.split_once("-").expect("could not split");
                (
                    start
                        .parse::<usize>()
                        .expect("could not parse start to int"),
                    end.parse::<usize>().expect("could not parse end to int"),
                )
            })
            .collect::<Vec<_>>();
        let mut sum = 0;
        for id in ids
            .lines()
            .map(|x| x.parse::<usize>().expect("could not parse to int"))
        {
            if in_ranges(id, &parsed_ranges) {
                sum += 1;
            }
        }

        Ok(sum)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(3, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
