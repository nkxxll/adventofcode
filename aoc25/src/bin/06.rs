use anyhow::*;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/06.txt";

enum Part {
    One,
    Two,
}

enum Operator {
    Plus,
    Times,
}

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn split_line(line: &str, positions: &Vec<usize>) -> Vec<String> {
    let mut res = Vec::new();
    for range in positions.windows(2) {
        let start = range[0];
        let end = range[1];
        let part = line[start..end].to_string();
        res.push(part)
    }
    res
}

fn get_columns(number_lines: &Vec<Vec<String>>) -> Vec<Vec<usize>> {
    let mut res = Vec::new();
    for x in 0..number_lines[0].len() {
        let mut current_vec = Vec::new();
        for pos in 0..number_lines[0][x].len() {
            let mut current_number = String::new();
            for y in 0..number_lines.len() {
                let current_num = &number_lines[y][x];
                let pos_char = current_num
                    .chars()
                    .nth(pos)
                    .expect("char at index could not be accessed");
                current_number.push(pos_char);
            }
            if current_number.trim() != "" {
                current_vec.push(
                    current_number
                        .trim()
                        .parse::<usize>()
                        .expect("this number should be parse-able"),
                );
            }
        }
        res.push(current_vec);
    }
    res
}

fn main() -> Result<()> {
    //region Part 1
    let TEST: String = vec![
        "123 328  51 64 ",
        " 45 64  387 23 ",
        "  6 98  215 314",
        "*   +   *   +  ",
    ]
    .join("\n");
    println!("=== Part 1 ===");
    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        use Operator::*;
        let mut lines = reader.lines().flatten().collect::<Vec<String>>();
        let operator_line = lines.pop().context("no operator line")?;

        // Parse operators and their column positions
        let mut operators = Vec::new();
        let mut positions = Vec::new();
        for (i, c) in operator_line.chars().enumerate() {
            match c {
                '+' => {
                    positions.push(i);
                    operators.push(Plus);
                }
                '*' => {
                    positions.push(i);
                    operators.push(Times);
                }
                ' ' => {}
                _ => bail!("unexpected character in operator line"),
            }
        }
        positions.push(lines[0].len());

        let number_lines = lines
            .iter()
            .map(|x| split_line(x, &positions))
            .collect::<Vec<_>>();

        let columns = get_columns(&number_lines);

        let mut sum = 0;
        for (index, operator) in operators.iter().enumerate() {
            match operator {
                Plus => sum += columns[index].iter().fold(0, |acc, x| acc + x),
                Times => sum += columns[index].iter().fold(1, |acc, x| acc * x),
            }
        }
        return Ok(sum);
    }

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        use Operator::*;
        let mut lines = reader.lines().flatten().collect::<Vec<String>>();
        let operator_line = lines.pop().context("no operator line")?;

        // Parse operators and their column positions
        let mut operators = Vec::new();
        let mut positions = Vec::new();
        for (i, c) in operator_line.chars().enumerate() {
            match c {
                '+' => {
                    positions.push(i);
                    operators.push(Plus);
                }
                '*' => {
                    positions.push(i);
                    operators.push(Times);
                }
                ' ' => {}
                _ => bail!("unexpected character in operator line"),
            }
        }

        // Parse numbers from each line by splitting on whitespace
        let mut all_numbers = Vec::new();
        for line in &lines {
            let numbers: Vec<usize> = line
                .split_whitespace()
                .map(|s| s.parse::<usize>())
                .collect::<Result<Vec<_>, _>>()?;
            all_numbers.push(numbers);
        }

        // Process each column with its operator
        let mut sum = 0;
        let num_cols = all_numbers[0].len();
        for col_idx in 0..num_cols {
            let mut result = all_numbers[0][col_idx];
            for row_idx in 1..all_numbers.len() {
                let value = all_numbers[row_idx][col_idx];
                result = match operators[col_idx] {
                    Plus => result + value,
                    Times => result * value,
                };
            }
            sum += result;
        }

        Ok(sum)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(4277556, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    assert_eq!(3263827, part2(BufReader::new(TEST.as_bytes()))?);
    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
