use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/04.txt";

enum Part {
    One,
    Two,
}

const TEST: &str = "..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@."; // TODO: Add the test input

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

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let mut map: Vec<Vec<char>> = reader
            .lines()
            .flatten()
            .map(|line| line.chars().collect())
            .collect();
        let directions: [(i32, i32); 8] = [
            (1, 1),
            (1, 0),
            (1, -1),
            (0, 1),
            (0, -1),
            (-1, 1),
            (-1, 0),
            (-1, -1),
        ];
        let mut answer = 0;
        loop {
            let old = map.clone();
            let old_answer = answer;
            for (line_index, line) in old.iter().enumerate() {
                for (char_index, char) in line.iter().enumerate() {
                    if *char != '@' {
                        continue;
                    };
                    let mut sum = 0;
                    for (x, y) in directions {
                        if line_index as i32 + y >= map.len() as i32
                            || line_index as i32 + y < 0
                            || char_index as i32 + x >= map[0].len() as i32
                            || char_index as i32 + x < 0
                        {
                            continue;
                        }
                        let neighbour =
                            map[(line_index as i32 + y) as usize][(char_index as i32 + x) as usize];
                        if neighbour == '@' {
                            sum += 1;
                        }
                    }
                    if sum < 4 {
                        map[line_index][char_index] = '.';
                        answer += 1;
                    }
                }
            }
            if old_answer == answer {
                break;
            }
        }
        Ok(answer)
    }

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let map: Vec<Vec<char>> = reader
            .lines()
            .flatten()
            .map(|line| line.chars().collect())
            .collect();
        let directions: [(i32, i32); 8] = [
            (1, 1),
            (1, 0),
            (1, -1),
            (0, 1),
            (0, -1),
            (-1, 1),
            (-1, 0),
            (-1, -1),
        ];
        let mut answer = 0;
        for (line_index, line) in map.iter().enumerate() {
            for (char_index, char) in line.iter().enumerate() {
                if *char != '@' {
                    continue;
                };
                let mut sum = 0;
                for (x, y) in directions {
                    if line_index as i32 + y >= map.len() as i32
                        || line_index as i32 + y < 0
                        || char_index as i32 + x >= map[0].len() as i32
                        || char_index as i32 + x < 0
                    {
                        continue;
                    }
                    let neighbour =
                        map[(line_index as i32 + y) as usize][(char_index as i32 + x) as usize];
                    if neighbour == '@' {
                        sum += 1;
                    }
                }
                if sum < 4 {
                    answer += 1;
                }
            }
        }
        Ok(answer)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(13, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
