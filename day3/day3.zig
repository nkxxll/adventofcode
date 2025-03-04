const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;

pub fn main() !void {
    var res1: usize = 0;
    var res2: usize = 0;
    var allocator = std.heap.page_allocator;

    const file_path = "./input.txt";

    const file = try std.fs.cwd().openFile(file_path, .{});
    const contents = try file.readToEndAlloc(allocator, std.math.maxInt(usize));

    defer allocator.free(contents);

    res1 = try sol1(contents, allocator);
    res2 = try sol2();
    std.debug.print("res1: {d}, res2: {d}\n", .{ res1, res2 });
}

fn sol2() !usize {
    return 1;
}

fn sol1(line: []const u8, allocator: Allocator) !usize {
    var res: usize = 0;
    var first = ArrayList(u8).init(allocator);
    defer first.deinit();
    var second = ArrayList(u8).init(allocator);
    defer second.deinit();
    var idx: usize = 0;
    while (idx < line.len) {
        while (idx < line.len and line[idx] != 'm') {
            idx += 1;
        }
        idx += 1;
        if (idx < line.len and line[idx] == 'u') {
            idx += 1;
        } else {
            idx += 1;
            continue;
        }
        if (idx < line.len and line[idx] == 'l') {
            idx += 1;
        } else {
            idx += 1;
            continue;
        }
        if (idx < line.len and line[idx] == '(') {
            idx += 1;
        } else {
            idx += 1;
            continue;
        }
        while (idx < line.len and std.ascii.isDigit(line[idx])) {
            try first.append(line[idx]);
            idx += 1;
        }
        if (idx < line.len and line[idx] == ',' and first.items.len > 0) {
            idx += 1;
        } else {
            idx += 1;
            first.clearRetainingCapacity();
            continue;
        }
        while (idx < line.len and std.ascii.isDigit(line[idx])) {
            try second.append(line[idx]);
            idx += 1;
        }
        if (idx < line.len and line[idx] == ')' and second.items.len > 0) {
            const f = try std.fmt.parseInt(usize, first.items, 10);
            const s = try std.fmt.parseInt(usize, second.items, 10);
            res += f * s;
            idx += 1;
        }
        first.clearRetainingCapacity();
        second.clearRetainingCapacity();
    }
    return res;
}
