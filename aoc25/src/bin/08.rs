use anyhow::*;
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT_FILE: &str = "input/08.txt";

#[allow(dead_code)]
enum Part {
    One,
    Two,
}

const TEST: &str = "162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689"; // TODO: Add the test input

fn run<F, T>(f: F) -> anyhow::Result<T>
where
    F: FnOnce(BufReader<File>, usize) -> anyhow::Result<T>,
{
    let file = File::open(INPUT_FILE)?;
    let reader = BufReader::new(file);
    f(reader, 1000)
}

#[derive(PartialEq, Debug, Copy, Clone)]
struct Point {
    x: u64,
    y: u64,
    z: u64,
}

impl Point {
    fn square_distance(self: &Self, other: &Point) -> u64 {
        self.x.abs_diff(other.x).pow(2)
            + self.y.abs_diff(other.y).pow(2)
            + self.z.abs_diff(other.z).pow(2)
    }
}

struct UnionFind {
    parent: Vec<usize>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: (0..n).collect(),
        }
    }

    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }

    fn union(&mut self, x: usize, y: usize) {
        let px = self.find(x);
        let py = self.find(y);
        if px != py {
            self.parent[px] = py;
        }
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
                let coords: Vec<u64> = x
                    .split(',')
                    .map(|c| c.parse::<u64>().expect("parseable"))
                    .collect();
                Point {
                    x: coords[0],
                    y: coords[1],
                    z: coords[2],
                }
            })
            .collect()
    }

    fn common(lines: &Vec<Point>) -> Vec<(u64, usize, usize)> {
        // Build distance pairs
        let mut distances = Vec::new();
        for i in 0..lines.len() {
            for j in i + 1..lines.len() {
                distances.push((lines[i].square_distance(&lines[j]), i, j));
            }
        }
        distances.sort_by_key(|(d, _, _)| *d);
        distances
    }

    fn part1<R: BufRead>(reader: R, n: usize) -> Result<usize> {
        // Union-Find to merge circuits
        let lines = process_lines(reader);
        let distances = common(&lines);
        let mut uf = UnionFind::new(lines.len());
        for (_, i, j) in distances.iter().take(n) {
            uf.union(*i, *j);
        }

        // Count circuit sizes
        let mut circuit_sizes: HashMap<usize, usize> = HashMap::new();
        for i in 0..lines.len() {
            let root = uf.find(i);
            *circuit_sizes.entry(root).or_insert(0) += 1;
        }

        // Get 3 largest
        let mut sizes: Vec<usize> = circuit_sizes.values().copied().collect();
        sizes.sort();

        Ok(sizes.iter().rev().take(3).product::<usize>())
    }
    fn part2<R: BufRead>(reader: R, _n: usize) -> Result<usize> {
        let lines = process_lines(reader);
        let distances = common(&lines);

        let mut index = 0;
        let mut uf = UnionFind::new(lines.len());
        let sum;
        loop {
            let (_, i, j) = distances[index];
            uf.union(i, j);
            let root = uf.find(0);
            let any_other = lines.iter().enumerate().any(|(i, _)| root != uf.find(i));
            if !any_other {
                let x = lines[i];
                let y = lines[j];
                sum = x.x * y.x;
                break;
            }
            index += 1;
        }
        Ok(sum as usize)
    }

    // TODO: Set the expected answer for the test input
    assert_eq!(40, part1(BufReader::new(TEST.as_bytes()), 10usize)?);

    let res1 = run(part1)?;
    println!("Result = {}", res1);
    //endregion
    assert_eq!(25272, part2(BufReader::new(TEST.as_bytes()), 10usize)?);

    let res2 = run(part2)?;
    println!("Result = {}", res2);

    //Part 2

    Ok(())
}
