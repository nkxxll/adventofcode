const std = @import("std");
const assert = std.debug.assert;

pub const Task = enum {
    one,
    two,
};

fn openFile(day: u16, is_test: bool) !std.fs.File {
    var buf: [124]u8 = undefined;
    const file_name = if (!is_test) try std.fmt.bufPrint(&buf, "inputs/{d}.txt", .{day}) else try std.fmt.bufPrint(&buf, "inputs/{d}test.txt", .{day});
    const file = try std.fs.cwd().openFile(file_name, .{});
    return file;
}

fn getNumber2(line: []const u8, i: usize, j: usize) !usize {
    var buf: [2]u8 = undefined;
    const n = try std.fmt.bufPrint(&buf, "{c}{c}", .{ line[i], line[j] });
    assert(n.len == 2);
    const num = try std.fmt.parseInt(usize, n, 10);
    return num;
}

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

pub fn dayThree(task: Task, is_test: bool) !usize {
    var file = try openFile(3, is_test);

    defer file.close();

    // Things are _a lot_ slower if we don't use a BufferedReader
    var buffer: [1024]u8 = undefined;
    var reader = file.readerStreaming(&buffer);
    const reader_interface = &reader.interface;

    var sum: usize = 0;
    while (true) {
        var max: usize = 0;
        const line = reader_interface.takeDelimiterExclusive('\n') catch |err| switch (err) {
            error.EndOfStream => break,
            else => return err,
        };

        switch (task) {
            .one => {
                for (0..line.len - 1) |i| {
                    for (i + 1..line.len) |j| {
                        const num = try getNumber2(line, i, j);
                        max = @max(max, num);
                    }
                }
            },
            .two => {
                for (0..line.len - 1) |i| {
                    for (i + 1..line.len) |j| {
                        for (j + 1..line.len) |k| {
                            for (k + 1..line.len) |l| {
                                for (l + 1..line.len) |m| {
                                    for (m + 1..line.len) |n| {
                                        for (n + 1..line.len) |o| {
                                            for (o + 1..line.len) |p| {
                                                for (p + 1..line.len) |q| {
                                                    for (q + 1..line.len) |r| {
                                                        for (r + 1..line.len) |s| {
                                                            for (s + 1..line.len) |t| {
                                                                const num = try getNumber12(line, i, j, k, l, m, n, o, p, q, r, s, t);
                                                                max = @max(max, num);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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
