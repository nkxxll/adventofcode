const std = @import("std");
const aoc25 = @import("aoc25");

fn printHelp(stdout: *std.io.Writer) !void {
    try stdout.print("Usage: zig build run -- --day <number>\n\n", .{});
    try stdout.print("Options:\n", .{});
    try stdout.print("  --day <number>   Run a specific day (1-3)\n", .{});
    try stdout.print("  --help           Show this help message\n\n", .{});
    try stdout.print("Examples:\n", .{});
    try stdout.print("  zig build run -- --day 1\n", .{});
    try stdout.print("  zig build run -- --day 3\n", .{});
}

fn printDay(day_nr: u16, comptime dayFunc: fn (task: aoc25.Task, is_test: bool) anyerror!usize, stdout: *std.io.Writer) !void {
    try stdout.print("Day {d}:\n", .{day_nr});
    try stdout.print("=== Tests ===\n", .{});

    const test_task1 = try dayFunc(aoc25.Task.one, true);
    try stdout.print("  Task 1: {d}\n", .{test_task1});

    const test_task2 = try dayFunc(aoc25.Task.two, true);
    try stdout.print("  Task 2: {d}\n", .{test_task2});

    try stdout.print("=== Real ===\n", .{});

    const real_task1 = try dayFunc(aoc25.Task.one, false);
    try stdout.print("  Task 1: {d}\n", .{real_task1});

    const real_task2 = try dayFunc(aoc25.Task.two, false);
    try stdout.print("  Task 2: {d}\n\n", .{real_task2});
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer {
        if (gpa.deinit() != .ok) {
            std.debug.print("Memory leak detected!\n", .{});
            std.process.exit(1);
        }
    }

    const allocator = gpa.allocator();
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    var stdout_writer = std.fs.File.stdout().writerStreaming(&.{});
    var stdout = &stdout_writer.interface;
    var selected_day: ?u16 = null;

    var i: usize = 1;
    while (i < args.len) : (i += 1) {
        if (std.mem.eql(u8, args[i], "--help")) {
            try printHelp(stdout);
            return;
        } else if (std.mem.eql(u8, args[i], "--day")) {
            if (i + 1 >= args.len) {
                try stdout.print("Error: --day requires a number argument\n\n", .{});
                try printHelp(stdout);
                std.process.exit(1);
            }

            const day_str = args[i + 1];
            const parsed_day = std.fmt.parseInt(u16, day_str, 10) catch {
                try stdout.print("Error: '{s}' is not a valid number\n\n", .{day_str});
                try printHelp(stdout);
                std.process.exit(1);
            };

            if (parsed_day < 1 or parsed_day > 3) {
                try stdout.print("Error: day {d} is not implemented (available: 1-3)\n\n", .{parsed_day});
                try printHelp(stdout);
                std.process.exit(1);
            }

            selected_day = parsed_day;
            i += 1;
        } else {
            try stdout.print("Error: unknown argument '{s}'\n\n", .{args[i]});
            try printHelp(stdout);
            std.process.exit(1);
        }
    }

    if (selected_day) |day| {
        try stdout.print("Running Day {d}...\n\n", .{day});
        switch (day) {
            1 => try printDay(1, aoc25.dayOne, stdout),
            2 => try printDay(2, aoc25.dayTwo, stdout),
            3 => try printDay(3, aoc25.dayThree, stdout),
            else => unreachable,
        }
    } else {
        try stdout.print("Error: --day argument is required\n\n", .{});
        try printHelp(stdout);
        std.process.exit(1);
    }
}
