const std = @import("std");
const Allocator = std.mem.Allocator;
eonst ArrayList = std.ArrayList;

const Point = struct {
    x: isize,
    y: isize,
};

const directions = [_]Point{
    .{ .x = 0, .y = -1 },
    .{ .x = 1, .y = 0 },
    .{ .x = 0, .y = 1 },
    .{ .x = -1, .y = 0 },
};

const ConvertError = error{NegativeValue};

const Map = struct {
    width: usize,
    array_list: ArrayList(u8),

    fn get(self: Map, x: isize, y: isize) ?u8 {
        const ux = std.math.cast(usize, x) orelse return null;
        const uy = std.math.cast(usize, y) orelse return null;
        const idx: usize = ux + self.width * uy;
        if (idx > self.array_list.items.len) return null;
        return self.array_list.items[idx];
    }

    fn getStart(self: Map, array_list: ArrayList(u8)) ?Point {
        const pos = std.mem.indexOf(u8, array_list.items, "^") orelse return null;
        const x: isize = @intCast(pos % self.width);
        const y: isize = @intCast(pos / self.width);
        return .{ .x = x, .y = y };
    }

    fn init(width: usize, array_list: ArrayList(u8)) Map {
        return Map{ .width = width, .array_list = array_list };
    }

    fn set(self: Map, x: isize, y: isize, char: u8) !void {
        const ux = std.math.cast(usize, x) orelse return ConvertError.NegativeValue;
        const uy = std.math.cast(usize, y) orelse return ConvertError.NegativeValue;
        const idx: usize = ux + self.width * uy;
        self.array_list.items[idx] = char;
    }
};

pub fn main() !void {
    var allocator = std.heap.page_allocator;

    const file_path = "./input.txt";

    const file = try std.fs.cwd().openFile(file_path, .{});
    const contents = try file.readToEndAlloc(allocator, std.math.maxInt(usize));
    var array_list = try ArrayList(u8).initCapacity(allocator, contents.len);

    defer allocator.free(contents);
    try array_list.appendSlice(contents);
    defer array_list.deinit();

    const width = std.mem.indexOf(u8, array_list.items, "\n").?;

    while (std.mem.indexOf(u8, array_list.items, "\n")) |idx| {
        _ = array_list.orderedRemove(idx);
    }

    const map = Map.init(width, array_list);
    var current = map.getStart(array_list).?;
    var count: usize = 1;
    var dir: Point = .{ .x = 0, .y = -1 };
    var dir_idx: usize = 0;
    while (map.get(current.x, current.y)) |_| {
        // next
        const next: Point = .{ .x = current.x + dir.x, .y = current.y + dir.y };

        if (map.get(next.x, next.y)) |n| {
            // std.debug.print("{c}", .{n});
            switch (n) {
                '#' => {
                    dir_idx = (dir_idx + 1) % 4;
                    dir = directions[dir_idx];
                    continue;
                },
                '.' => {
                    try map.set(next.x, next.y, 'X');
                    count += 1;

                    current = next;
                },
                'X' => {
                    current = next;
                },
                '^' => {
                    current = next;
                },
                else => {
                    unreachable;
                },
            }
        } else {
            break;
        }
    }

   std.debug.print("res1: {d}, res2: {d}\n", .{ count, 0 });
}
