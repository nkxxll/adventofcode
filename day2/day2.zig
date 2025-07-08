const std = @import("std");
const Allocator = std.mem.Allocator;
const ArrayList = std.ArrayList;
const SplitIterator = std.mem.SplitIterator;
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        const leaked = gpa.deinit();
        if (leaked == .leak) {
            std.debug.print("Memory leaked!\n", .{});
        }
    }
    const buffer = try read_lines("input.txt", allocator);
    var lines = std.mem.splitScalar(u8, buffer, '\n');
    defer allocator.free(buffer);

    var count: usize = 0;
    while (lines.next()) |line| {
        if (std.mem.eql(u8, line, "")) continue;
        var line_split = std.mem.splitScalar(u8, line, ' ');
        var is_ok = true;
        const first = if (line_split.next()) |number| try std.fmt.parseInt(isize, number, 10) else @panic("number is not there");
        const second = if (line_split.next()) |number| try std.fmt.parseInt(isize, number, 10) else @panic("number is not there");
        // direction is is true if down and up if false
        const direction = first > second;
        line_split.reset();
        _ = line_split.next();
        var last: isize = first;
        while (line_split.next()) |number| {
            const value = try std.fmt.parseInt(isize, number, 10);
            const distance = @abs(value - last);
            if (distance < 1 or distance > 3) {
                is_ok = false;
                break;
            }
            if (direction and last <= value) {
                is_ok = false;
                break;
            }
            if (!direction and last >= value) {
                is_ok = false;
                break;
            }
            last = value;
        }
        if (is_ok) count += 1;
    }
    print("The count is {}\n", .{count});
}

pub fn read_lines(file: []const u8, gpa: Allocator) ![]const u8 {
    const fh = try std.fs.cwd().openFile(file, .{});
    const file_size = try fh.getEndPos();
    const buffer = try gpa.alloc(u8, file_size);
    _ = try fh.readAll(buffer);

    defer fh.close();

    return buffer;
}
