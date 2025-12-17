use anyhow::*;
use std::collections::{HashSet, VecDeque};
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/10.txt";

#[allow(dead_code)]
enum Part {
    One,
    Two,
}

const TEST: &str = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}"; // TODO: Add the test input

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

    fn process_input<R: BufRead>(reader: R) -> Vec<(Vec<bool>, Vec<Vec<usize>>, Vec<u16>)> {
        let lines = reader.lines().flatten().collect::<Vec<_>>();
        lines
            .iter()
            .map(|x| {
                let splits = x.split(' ').collect::<Vec<&str>>();
                let lights = splits[0];
                let buttons = &splits[1..splits.len() - 1];
                let joltage = splits[splits.len() - 1];
                (
                    lights[1..lights.len() - 1]
                        .chars()
                        .map(|x| x == '#')
                        .collect::<Vec<bool>>(),
                    buttons
                        .iter()
                        .map(|x| {
                            let button = *x;
                            button[1..button.len() - 1]
                                .split(',')
                                .map(|x| x.parse::<usize>().unwrap())
                                .collect::<Vec<usize>>()
                        })
                        .collect::<Vec<Vec<usize>>>(),
                    joltage[1..joltage.len() - 1]
                        .split(',')
                        .map(|x| x.parse::<u16>().unwrap())
                        .collect::<Vec<u16>>(),
                )
            })
            .collect()
    }

    fn next_state(current: Vec<bool>, switch: &Vec<usize>) -> Vec<bool> {
        let mut current = current;
        for index in switch {
            current[*index] = !current[*index]
        }
        current
    }

    fn is_end(end: &Vec<bool>, current: &Vec<bool>) -> bool {
        *end == *current
    }

    fn next_state2(current: Vec<u16>, switch: &Vec<usize>) -> Vec<u16> {
        let mut current = current;
        for index in switch {
            current[*index] -= 1;
        }
        current
    }

    fn is_end2(current: &Vec<u16>) -> bool {
        current.iter().all(|&x| x == 0)
    }

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let lines = process_input(reader);

        let mut sum = 0;

        for line in lines {
            let mut queue: VecDeque<(Vec<u16>, usize)> = VecDeque::from(vec![(line.2.clone(), 0)]);
            let mut visited: HashSet<Vec<u16>> = HashSet::new();
            loop {
                let element = queue.pop_front().unwrap();
                if is_end2(&element.0) {
                    sum += element.1;
                    break;
                }
                if visited.insert(element.0.clone()) {
                    for switch in &line.1 {
                        queue.push_back((next_state2(element.0.clone(), switch), element.1 + 1));
                    }
                }
            }
        }
        Ok(sum)
    }

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let lines = process_input(reader);

        let mut sum = 0;

        for line in lines {
            let mut queue: VecDeque<(Vec<bool>, usize)> =
                VecDeque::from(vec![(vec![false; line.0.len()], 0)]);
            let mut visited: HashSet<Vec<bool>> = HashSet::new();
            loop {
                let element = queue.pop_front().unwrap();
                if is_end(&line.0, &element.0) {
                    sum += element.1;
                    break;
                }
                if visited.insert(element.0.clone()) {
                    for switch in &line.1 {
                        queue.push_back((next_state(element.0.clone(), switch), element.1 + 1));
                    }
                }
            }
        }
        Ok(sum)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(7, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion
    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
