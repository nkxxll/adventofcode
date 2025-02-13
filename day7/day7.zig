const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;

const path = "./input.txt";

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Open the file
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();

    // Read the contents
    const max_size = std.math.maxInt(usize);
    const contents = try file.readToEndAlloc(allocator, max_size);
    defer allocator.free(contents);

    var lines = std.mem.tokenize(u8, contents, "\n");
    var res: usize = 0;

    while (lines.next()) |line| {
        if (try possible(line, allocator)) |add| {
            res += add;
        }
    }
    std.debug.print("res {d}", .{res});
}

fn possible(line: []const u8, allocator: Allocator) !?usize {
    var res_equ = std.mem.split(u8, line, ":");
    const res = try std.fmt.parseInt(usize, res_equ.first(), 10);
    const equ = res_equ.next().?;

    var numbers = std.mem.tokenize(u8, equ, " ");

    var number_list = ArrayList(usize).init(allocator);
    defer number_list.deinit();

    while (numbers.next()) |number| {
        try number_list.append(try std.fmt.parseInt(usize, number, 10));
    }

    if (isValidCalibration(res, number_list.items, number_list.items[0], 0)) {
        return res;
    }

    return null;
}

fn isValidCalibration(target: usize, operands: []usize, current: usize, index: usize) bool {
    if (index >= operands.len - 1) return target == current;

    const new_index = index + 1;
    return isValidCalibration(target, operands, current + operands[new_index], new_index) or
        isValidCalibration(target, operands, current * operands[new_index], new_index);
}
