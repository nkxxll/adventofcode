const testing = false;

const file = testing ? "big_test_input.txt" : "input.txt";

const contents = await Bun.file(file).text();

let [map_string, dir] = contents.split("\n\n");
type Point = { x: number; y: number };

dir = dir.replace("\n", "");
map_string = map_string
  .replace("#", "##")
  .replace("@", "@.")
  .replace("O", "[]");
let map = map_string.split("\n").map((line) => line.split(""));

const robot = getRobotPos(map);

for (const dir_char of dir) {
  //console.log(dir_char);
  let point: Point = { x: 0, y: 0 };
  switch (dir_char) {
    case ">":
      point.x = 1;
      break;
    case "<":
      point.x = -1;
      break;
    case "^":
      point.y = -1;
      break;
    case "v":
      point.y = 1;
      break;
    default:
      console.assert("this should not happen");
  }

  const next = { x: robot.x + point.x, y: robot.y + point.y };
  const next_char = map[next.y][next.x];
  if (next_char === "#") {
    continue;
  }
  if (next_char === ".") {
    map[robot.y][robot.x] = ".";
    map[next.y][next.x] = "@";
    robot.x = next.x;
    robot.y = next.y;
    continue;
  }

  if (next_char === "[") {
    // if up then
    // if [ and next is [ and next is . then push
    // if [ and next is ] and diagonal is [ then stop
    // if [ and next is ] and diagonal is . then and next is . then push
    // if [ and next is ] and diagonal is . then and next is [ then stop
    // ...
  }
  if (next_char === "]") {
    // if up then
    // if ] and next is [ and next is . then push
    // if ] and next is ] and diagonal is [ then stop
    // if ] and next is ] and diagonal is . then and next is . then push
    // if ] and next is ] and diagonal is . then and next is [ then stop
    // ...
  }

  console.log(map.map((line) => line.join("")).join("\n"));
}

var res = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    if (map[i][j] === "O") res += 100 * i + j;
  }
}
console.log(res);

function getRobotPos(map: string[][]): Point {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "@") {
        return { x: j, y: i };
      }
    }
  }
  return { x: -1, y: -1 };
}

function tryPush(current: Point, direction: Point): boolean {
  const next = { x: current.x + direction.x, y: current.y + direction.y };
  switch (map[next.y][next.x]) {
    case "#":
      return false;
    case ".":
      map[next.y][next.x] = "O";
      return true;
    case "O":
      if (tryPush(next, direction)) {
        map[next.y][next.x] = "O";
        return true;
      } else {
        return false;
      }
    default:
      console.assert("this should not happen");
      return false;
  }
}
