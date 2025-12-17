use anyhow::*;
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/11.txt";

#[allow(dead_code)]
enum Part {
    One,
    Two,
}

const TEST: &str = "aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out"; // TODO: Add the test input

const TEST2: &str = "svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader)
}

fn process_input<R: BufRead>(reader: R) -> HashMap<String, Vec<String>> {
    let mut hs = HashMap::new();
    reader.lines().flatten().for_each(|line| {
        let (key, value) = line.split_once(": ").unwrap();
        let value = value.split(" ").map(|s| s.to_string()).collect();
        hs.insert(key.to_string(), value);
    });
    hs
}

fn walk_memo_two(
    hm: &HashMap<String, Vec<String>>,
    current: &str,
    saw_dac: bool,
    saw_fft: bool,
    memo: &mut HashMap<(String, bool, bool), usize>,
) -> usize {
    let key = (current.to_string(), saw_dac, saw_fft);
    if let Some(&cached) = memo.get(&key) {
        return cached;
    }
    
    let mut saw_dac = saw_dac;
    let mut saw_fft = saw_fft;
    if current == "out" && saw_dac && saw_fft {
        return 1;
    } else if current == "out" {
        return 0;
    } else if current == "dac" {
        saw_dac = true;
    } else if current == "fft" {
        saw_fft = true;
    }
    let values = hm.get(current).unwrap();
    let count: usize = values
        .iter()
        .map(|k| walk_memo_two(hm, k, saw_dac, saw_fft, memo))
        .sum();
    memo.insert(key, count);
    count
}

#[allow(dead_code)]
fn walk_nomemo(hm: &HashMap<String, Vec<String>>, current: &str) -> usize {
    if current == "out" {
        return 1;
    }
    let values = hm.get(current).unwrap();
    let count: usize = values.iter().map(|key| walk_nomemo(hm, key)).sum();
    count
}

#[allow(dead_code)]
fn walk(
    hm: &HashMap<String, Vec<String>>,
    current: &str,
    memo: &mut HashMap<String, usize>,
) -> usize {
    if current == "out" {
        return 1;
    }
    if let Some(&cached) = memo.get(current) {
        return cached;
    }
    let values = hm.get(current).unwrap();
    let count: usize = values.iter().map(|key| walk(hm, key, memo)).sum();
    memo.insert(current.to_string(), count);
    count
}

fn main() -> Result<()> {
    //region Part 1
    println!("=== Part 1 ===");

    fn part1<R: BufRead>(reader: R) -> Result<usize> {
        // TODO: Solve Part 1 of the puzzle
        let hm = process_input(reader);
        let mut memo = HashMap::new();
        Ok(walk(&hm, "you", &mut memo))
        // Ok(walk_nomemo(&hm, "you"))
    }

    fn part2<R: BufRead>(reader: R) -> Result<usize> {
        let hm = process_input(reader);
        let mut memo = HashMap::new();
        Ok(walk_memo_two(&hm, "svr", false, false, &mut memo))
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(5, part1(BufReader::new(TEST.as_bytes()))?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion

    assert_eq!(2, part2(BufReader::new(TEST2.as_bytes()))?);
    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
