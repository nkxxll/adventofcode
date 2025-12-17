use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};
use std::slice::Windows;

const INPUT_FILE: &str = "input/09.txt";

#[allow(dead_code)]
enum Part {
    One,
    Two,
}

const TEST: &str = "7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

struct Point {
    x: u64,
    y: u64,
}

impl Point {
    fn square(self: &Self, other: &Point) -> u64 {
        // inclusive
        (self.x.abs_diff(other.x) + 1) * (self.y.abs_diff(other.y) + 1)
    }
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn process_lines<R: BufRead>(reader: R) -> Vec<Point> {
        reader
            .lines()
            .flatten()
            .map(|x| {
                x.split(',')
                    .collect::<Vec<&str>>()
                    .iter()
                    .map(|x| x.parse::<u64>().expect("parsable"))
                    .collect::<Vec<u64>>()
            })
            .map(|x| Point { x: x[0], y: x[1] })
            .collect::<Vec<Point>>()
    }

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        let red_tiles = process_lines(reader);
        let lines = red_tiles.windows(2).collect::<Vec<_>>();
        let mut max_box = Vec::new();
        for i in 0..lines.len() {
            for j in i + 1..lines.len() {
                let x = &red_tiles[i];
                let y = &red_tiles[j];
                let square = x.square(y);
                max_box.push((x, y, square));
            }
        }
        max_box.sort_by_key(|(_, _, key)| *key);

        let res = max_box
            .iter()
            .rev()
            .find(|(a, b, _area)| {
                lines.iter().all(|start_end| {
                    // if line is to left
                    let line_start = &start_end[0];
                    let line_end = &start_end[1];
                    let left_of_rect = a.x.max(b.x) <= line_start.x.min(line_end.x);
                    let right_of_rect = a.x.min(b.x) >= line_start.x.max(line_end.x);
                    let above = a.y.max(b.y) <= line_start.y.min(line_end.y);
                    let below = a.y.min(b.y) >= line_start.y.max(line_end.y);
                    left_of_rect || right_of_rect || above || below
                })
            })
            .expect("res has to be there");
        Ok(res.2 as usize)
    }

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let lines = process_lines(reader);
        let mut max = 0;
        for i in 0..lines.len() {
            for j in i + 1..lines.len() {
                let x = &lines[i];
                let y = &lines[j];
                let square = x.square(y);
                if max < square {
                    max = square;
                }
            }
        }
        Ok(max as usize)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(50, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion
    let res2 = run(part2)?;
    println!("Result = {}", res2);
    //Part 2

    Ok(())
}
