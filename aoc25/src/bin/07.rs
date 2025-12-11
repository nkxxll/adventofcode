use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/07.txt";

enum Part {
    One,
    Two,
}

const TEST: &str = ".......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
..............."; // TODO: Add the test input

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
        let lines = reader.lines().flatten().collect::<Vec<_>>();
        let s_index = lines[0]
            .find('S')
            .expect("there has to be a S in the first line");
        use std::collections::HashMap;

        // Track positions at current level and how many ways to reach them
        let mut current: HashMap<usize, usize> = HashMap::new();
        current.insert(s_index, 1);

        for level in 0..lines.len() - 1 {
            let mut next: HashMap<usize, usize> = HashMap::new();

            for (pos, ways) in current {
                let char_under = lines[level + 1]
                    .chars()
                    .nth(pos)
                    .expect("there has to be a char here");

                match char_under {
                    '.' => {
                        *next.entry(pos).or_insert(0) += ways;
                    }
                    '^' => {
                        if pos as isize - 1 > 0 {
                            *next.entry((pos as isize - 1) as usize).or_insert(0) += ways;
                        }
                        if pos + 1 < lines[0].len() {
                            *next.entry(pos + 1).or_insert(0) += ways;
                        }
                    }
                    _ => panic!("there should no other char be here"),
                }
            }

            current = next;
        }
        dbg!(&current);
        Ok(current.values().sum::<usize>())
    }
    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let mut lines = reader.lines().flatten().collect::<Vec<_>>();
        let s_index = lines[0]
            .find('S')
            .expect("there has to be a S in the first line");
        lines[0].replace_range(s_index..s_index + 1, "|");
        let mut sum = 0;
        for line_index in 0..lines.len() - 1 {
            let (full_upper, full_lower) = lines.split_at_mut(line_index + 1);
            let upper = &full_upper[full_upper.len() - 1];
            let lower = &mut full_lower[0];
            for index in 0..lower.chars().count() {
                if lower
                    .chars()
                    .nth(index)
                    .expect("there has to be a char here")
                    == '^'
                {
                    if upper.chars().nth(index).expect("this also has be be here") == '|' {
                        if (index as isize - 1) >= 0 {
                            lower.replace_range((index as isize - 1) as usize..index, "|");
                        }
                        if index + 1 < lower.len() {
                            lower.replace_range(index + 1..index + 2, "|");
                        }
                        sum += 1;
                    }
                } else if lower
                    .chars()
                    .nth(index)
                    .expect("there has to be a char here")
                    == '.'
                {
                    if upper.chars().nth(index).expect("this also has be be here") == '|' {
                        lower.replace_range(index..index + 1, "|");
                    }
                }
            }
        }
        Ok(sum)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(21, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    assert_eq!(40, part2(BufReader::new(TEST.as_bytes()))?);
    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
