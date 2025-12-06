const std = @import("std");
const assert = std.debug.assert;
const Allocator = std.mem.Allocator;
const CharScalarSplitIterator = std.mem.SplitIterator(u8, .scalar);
const ArrayList = std.ArrayList;

pub const Task = enum {
    one,
    two,
};

const Operator = enum {
    times,
    add,
};

const RangeIterator = struct {
    start: usize,
    index: usize,
    end: usize,

    pub fn next(self: *RangeIterator) ?usize {
        if (self.index >= self.end) return null;
        const value = self.index;
        self.index += 1;
        return value;
    }

    pub fn reset(self: *RangeIterator) void {
        self.index = self.start;
    }

    pub fn init(start: usize, end: usize) RangeIterator {
        return RangeIterator{ .start = start, .index = start, .end = end };
    }
};

const Range = struct {
    start: usize,
    end: usize,

    pub fn init(start: usize, end: usize) Range {
        return Range{ .start = start, .end = end };
    }

    pub fn compare(context_type: @TypeOf(.{}), self: Range, other: Range) bool {
        _ = context_type;
        return self.start < other.start;
    }

    pub fn iter(self: Range) RangeIterator {
        return RangeIterator.init(self.start, self.end);
    }
};

fn openFile(day: u16, is_test: bool) !std.fs.File {
    var buf: [124]u8 = undefined;
    const file_name = if (!is_test) try std.fmt.bufPrint(&buf, "inputs/{d}.txt", .{day}) else try std.fmt.bufPrint(&buf, "inputs/{d}test.txt", .{day});
    const file = try std.fs.cwd().openFile(file_name, .{});
    return file;
}

fn readAll(file: std.fs.File, allocator: Allocator) ![]const u8 {
    const end = try file.getEndPos();
    const buffer = try allocator.alloc(u8, end);
    var reader = file.reader(buffer);
    const reader_interface = &reader.interface;

    try reader_interface.readSliceAll(buffer);
    return buffer;
}

pub fn daySix(task: Task, is_test: bool) !usize {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }
    const file = try openFile(6, is_test);
    const input = try readAll(file, allocator);
    defer allocator.free(input);
    var sum: usize = 0;
    var lines = std.mem.splitScalar(u8, input, '\n');

    switch (task) {
        .one => {
            var first_t = std.mem.tokenizeScalar(u8, lines.first(), ' ');
            var second_t = std.mem.tokenizeScalar(u8, lines.next().?, ' ');
            var third_t = std.mem.tokenizeScalar(u8, lines.next().?, ' ');
            var fourth_t = std.mem.tokenizeScalar(u8, lines.next().?, ' ');
            var operator_t = std.mem.tokenizeScalar(u8, lines.next().?, ' ');
            while (first_t.next()) |token| {
                const first = try std.fmt.parseInt(usize, token, 10);
                const second = try std.fmt.parseInt(usize, second_t.next().?, 10);
                const third = try std.fmt.parseInt(usize, third_t.next().?, 10);
                const fourth = try std.fmt.parseInt(usize, fourth_t.next().?, 10);
                const operator = operator_t.next().?;
                switch (operator[0]) {
                    '+' => {
                        sum += first + second + third + fourth;
                    },
                    '*' => {
                        sum += first * second * third * fourth;
                    },
                    else => |c| {
                        std.debug.print("char {c}\n", .{c});
                        unreachable;
                    },
                }
            }
        },
        .two => {},
    }
    return sum;
}

pub fn dayFive(task: Task, is_test: bool) !usize {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }
    const file = try openFile(5, is_test);
    const input = try readAll(file, allocator);
    defer allocator.free(input);
    var sum: usize = 0;
    var split = std.mem.splitSequence(u8, input, "\n\n");
    var ranges = std.mem.splitScalar(u8, split.first(), '\n');
    var ids = std.mem.splitScalar(u8, split.next().?, '\n');

    switch (task) {
        .one => {
            outer: while (ids.next()) |id| {
                const id_int = try std.fmt.parseInt(usize, id, 10);
                ranges.reset();
                while (ranges.next()) |range| {
                    var range_split = std.mem.splitScalar(u8, range, '-');
                    const first = try std.fmt.parseInt(usize, range_split.first(), 10);
                    const second = try std.fmt.parseInt(usize, range_split.next().?, 10);
                    // std.debug.print("{d}-{d} {d}\n", .{ first, second, id_int });
                    if (id_int >= first and id_int <= second) {
                        sum += 1;
                        continue :outer;
                    }
                }
            }
        },
        .two => {
            var range_list = try ArrayList(Range).initCapacity(allocator, 256);
            defer range_list.deinit(allocator);

            while (ranges.next()) |range| {
                var range_split = std.mem.splitScalar(u8, range, '-');
                const first = try std.fmt.parseInt(usize, range_split.first(), 10);
                const second = try std.fmt.parseInt(usize, range_split.next().?, 10);
                try range_list.append(allocator, Range.init(first, second));
            }
            std.mem.sort(Range, range_list.items, .{}, Range.compare);

            var i: usize = 0;
            var j: usize = 0;
            while (i < range_list.items.len) {
                var r1 = range_list.items[i];
                j = i + 1;
                while (j < range_list.items.len) {
                    const r2 = range_list.items[j];
                    if (r2.start <= r1.end) {
                        r1 = Range.init(r1.start, @max(r1.end, r2.end));
                        range_list.items[i] = r1;
                        _ = range_list.orderedRemove(j);
                    } else {
                        break;
                    }
                }
                i += 1;
            }

            for (range_list.items) |item| {
                sum += item.end - item.start + 1;
            }
        },
    }
    return sum;
}

fn getIndexOfHighestDigit(line: []const u8) usize {
    var max_index: usize = 0;
    var max_value: u8 = 0;

    for (line, 0..) |char, index| {
        if (char > max_value) {
            max_value = char;
            max_index = index;
        }
    }

    return max_index;
}

fn getBiggestNumber(line: []const u8, comptime digits: usize, allocator: Allocator) !usize {
    var number: [digits]u8 = undefined;
    var remaining = try allocator.dupe(u8, line);
    defer allocator.free(remaining);
    for (0..digits) |index| {
        const min_remaining = digits - index;
        const index_of_biggest = getIndexOfHighestDigit(remaining[0 .. remaining.len - min_remaining + 1]);
        number[index] = remaining[index_of_biggest];
        const new_remaining = try allocator.dupe(u8, remaining[index_of_biggest + 1 ..]);
        allocator.free(remaining);
        remaining = new_remaining;
    }
    return try std.fmt.parseInt(usize, &number, 10);
}

fn getNumber2(line: []const u8, i: usize, j: usize) !usize {
    var buf: [2]u8 = undefined;
    const n = try std.fmt.bufPrint(&buf, "{c}{c}", .{ line[i], line[j] });
    assert(n.len == 2);
    const num = try std.fmt.parseInt(usize, n, 10);
    return num;
}

//def get_biggest(bank:str, amount:int):
//    number = ''
//    for x in range(-amount+1,0):
//        digit = str(max(map(int, bank[:x]))) # bank[:-12] on the first bank[:-11] on the second etc.
//        pos = bank.find(digit)
//        number = number + digit
//        bank = bank[pos+1:]
//    number = number + max(bank)
//    return int(number)
fn getNumber12(
    line: []const u8,
    i: usize,
    j: usize,
    k: usize,
    l: usize,
    m: usize,
    n: usize,
    o: usize,
    p: usize,
    q: usize,
    r: usize,
    s: usize,
    t: usize,
) !usize {
    var buf: [12]u8 = undefined;
    const num_str = try std.fmt.bufPrint(&buf, "{c}{c}{c}{c}{c}{c}{c}{c}{c}{c}{c}{c}", .{
        line[i],
        line[j],
        line[k],
        line[l],
        line[m],
        line[n],
        line[o],
        line[p],
        line[q],
        line[r],
        line[s],
        line[t],
    });
    assert(num_str.len == 12);
    const num = try std.fmt.parseInt(usize, num_str, 10);
    return num;
}

fn checkOutside(lines: []const []const u8, line_idx: isize, char_idx: isize) bool {
    if (line_idx >= lines.len or line_idx < 0) return true;
    if (char_idx >= lines[0].len or char_idx < 0) return true;
    return false;
}

fn getAllAdjacentRolls(lines: []const []const u8, line_idx: usize, char_idx: usize) usize {
    var sum: usize = 0;
    for (0..3) |y_idx| {
        const y = @as(isize, @intCast(y_idx)) - 1;
        for (0..3) |x_idx| {
            const x = @as(isize, @intCast(x_idx)) - 1;
            if (y == 0 and x == 0) continue;
            const next_y = @as(isize, @intCast(line_idx)) + y;
            const next_x = @as(isize, @intCast(char_idx)) + x;
            if (checkOutside(lines, next_y, next_x)) continue;
            if (lines[@as(usize, @intCast(next_y))][@as(usize, @intCast(next_x))] == '@') sum += 1;
        }
    }
    return sum;
}

fn interatorToOwnedSlice(comptime T: type, iterator: *CharScalarSplitIterator, allocator: Allocator) ![]T {
    var arraylist = try ArrayList(T).initCapacity(allocator, 64);
    defer arraylist.deinit(allocator);

    while (iterator.next()) |item| {
        const dupe_item: []u8 = try allocator.dupe(u8, item);
        try arraylist.append(allocator, dupe_item);
    }

    return try arraylist.toOwnedSlice(allocator);
}

fn dayFourRec(lines: [][]u8, last_sum: usize) usize {
    var sum: usize = 0;
    for (lines, 0..) |line, line_idx| {
        for (0..line.len) |char_idx| {
            if (line[char_idx] == '@') {
                const rolls = getAllAdjacentRolls(lines, line_idx, char_idx);
                if (rolls < 4) {
                    sum += 1;
                    lines[line_idx][char_idx] = '.';
                }
            }
        }
    }
    if (sum == 0) return last_sum;
    return dayFourRec(lines, last_sum + sum);
}

pub fn dayFour(task: Task, is_test: bool) !usize {
    var file = try openFile(4, is_test);

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }

    const end = try file.getEndPos();
    const buffer = try allocator.alloc(u8, end);
    defer allocator.free(buffer);
    var reader = file.reader(buffer);
    const reader_interface = &reader.interface;

    try reader_interface.readSliceAll(buffer);

    var lines_split = std.mem.splitScalar(u8, buffer, '\n');
    const lines = try interatorToOwnedSlice([]u8, &lines_split, allocator);
    defer {
        for (lines) |line| {
            allocator.free(line);
        }
        allocator.free(lines);
    }
    var sum: usize = 0;
    switch (task) {
        .one => {
            for (lines, 0..) |line, line_idx| {
                for (0..line.len) |char_idx| {
                    if (line[char_idx] == '@') {
                        const rolls = getAllAdjacentRolls(lines, line_idx, char_idx);
                        if (rolls < 4) sum += 1;
                    }
                }
            }
        },
        .two => {
            sum = dayFourRec(lines, 0);
        },
    }
    return sum;
}

pub fn dayThree(task: Task, is_test: bool) !usize {
    var file = try openFile(3, is_test);

    defer file.close();

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }

    // Things are _a lot_ slower if we don't use a BufferedReader
    var buffer: [1024]u8 = undefined;
    var reader = file.readerStreaming(&buffer);
    const reader_interface = &reader.interface;

    var sum: usize = 0;
    while (true) {
        var max: usize = 0;
        const line = reader_interface.takeDelimiter('\n') catch |err| switch (err) {
            else => return err,
        } orelse break;

        assert(line.len != 0);

        switch (task) {
            .one => {
                max = try getBiggestNumber(line, 2, allocator);
            },
            .two => {
                max = try getBiggestNumber(line, 12, allocator);
            },
        }
        sum += max;
    }
    return sum;
}

fn isRepeated(number: usize, parts: usize) bool {
    var buf: [24]u8 = undefined;
    const len = std.fmt.printInt(&buf, number, 10, std.fmt.Case.lower, .{});
    const num_string = buf[0..len];
    if (num_string.len % parts != 0) return false;
    const parts_len = len / parts;
    for (1..parts) |part| {
        for (0..parts_len) |part_len| {
            if (num_string[part_len] != num_string[part * parts_len + part_len]) return false;
        }
    }
    return true;
}

fn isRepeated2(number: usize) bool {
    if (isRepeated(number, 2)) return true;
    if (isRepeated(number, 3)) return true;
    if (isRepeated(number, 5)) return true;
    if (isRepeated(number, 7)) return true;
    return false;
}

pub fn dayTwo(task: Task, is_test: bool) !usize {
    var file = try openFile(2, is_test);

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }

    const end = try file.getEndPos();
    const buffer = try allocator.alloc(u8, end);
    defer allocator.free(buffer);
    var reader = file.reader(buffer);
    const reader_interface = &reader.interface;

    try reader_interface.readSliceAll(buffer);

    var sum: usize = 0;
    var split = std.mem.splitScalar(u8, buffer, ',');
    while (split.next()) |range| {
        var numbers = std.mem.splitScalar(u8, range, '-');
        const first = try std.fmt.parseInt(usize, numbers.next().?, 10);
        const second = try std.fmt.parseInt(usize, numbers.next().?, 10);
        for (first..second + 1) |number| {
            switch (task) {
                .one => {
                    if (isRepeated(number, 2)) sum += number;
                },
                .two => {
                    if (isRepeated2(number)) sum += number;
                },
            }
        }
    }
    return sum;
}

pub fn dayOne(task: Task, is_test: bool) !usize {
    var dial: isize = 50;
    var password: usize = 0;

    var file = try openFile(1, is_test);

    defer file.close();

    // Things are _a lot_ slower if we don't use a BufferedReader
    var buffer: [1024]u8 = undefined;
    var reader = file.readerStreaming(&buffer);
    const reader_interface = &reader.interface;

    while (true) {
        const line = reader_interface.takeDelimiterExclusive('\n') catch |err| switch (err) {
            error.EndOfStream => break,
            else => return err,
        };
        const dir = line[0];
        const num = line[1..line.len];

        switch (task) {
            .two => switch (dir) {
                'L' => {
                    const rounds = try std.fmt.parseInt(usize, num, 10);
                    if (dial == 0) password -= 1;
                    for (0..rounds) |_| {
                        dial -= 1;
                        if (dial == -1) {
                            password += 1;
                            dial = 99;
                        }
                    }
                    if (dial == 0) password += 1;
                },
                'R' => {
                    const rounds = try std.fmt.parseInt(usize, num, 10);
                    for (0..rounds) |_| {
                        dial += 1;
                        if (dial == 100) {
                            password += 1;
                            dial = 0;
                        }
                    }
                },
                else => unreachable,
            },
            .one => switch (dir) {
                'L' => {
                    const rounds = try std.fmt.parseInt(usize, num, 10);
                    for (0..rounds) |_| {
                        dial -= 1;
                        if (dial == -1) dial = 99;
                    }
                    if (dial == 0) password += 1;
                },
                'R' => {
                    const rounds = try std.fmt.parseInt(usize, num, 10);
                    for (0..rounds) |_| {
                        dial += 1;
                        if (dial == 100) dial = 0;
                    }
                    if (dial == 0) password += 1;
                },
                else => unreachable,
            },
        }
    }
    return password;
}
