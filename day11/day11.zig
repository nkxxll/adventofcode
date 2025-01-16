//! hard steel from this dude https://zigbin.io/987d48
const std = @import("std");

pub fn part2(allocator: std.mem.Allocator, input: []const u8) !usize {
    var it = std.mem.tokenizeAny(u8, input, "\n ");
    var stones = std.AutoArrayHashMap(usize, usize).init(allocator);
    defer stones.deinit();
    while (it.next()) |word| {
        const n = try std.fmt.parseInt(usize, word, 10);
        const tmp = try stones.getOrPutValue(n, 0);
        tmp.value_ptr.* += 1;
    }
    for (0..75) |_| {
        var tmp = std.AutoArrayHashMap(usize, usize).init(stones.allocator);
        defer tmp.deinit();
        for (stones.keys()) |k| {
            const v = stones.get(k).?;
            if (k == 0) {
                const t = try tmp.getOrPutValue(1, 0);
                t.value_ptr.* += v;
                continue;
            }
            const digits = std.math.log10_int(k) + 1;
            if (digits % 2 == 0) {
                const splitter = std.math.pow(usize, 10, digits / 2);
                const first = k / splitter;
                const second = k % splitter;
                var t = try tmp.getOrPutValue(first, 0);
                t.value_ptr.* += v;
                t = try tmp.getOrPutValue(second, 0);
                t.value_ptr.* += v;
                continue;
            }
            const t = try tmp.getOrPutValue(2024 * k, 0);
            t.value_ptr.* += v;
        }
        stones.clearAndFree();
        stones = try tmp.clone();
    }
    var acc: usize = 0;
    for (stones.keys()) |k| {
        acc += stones.get(k).?;
    }
    return acc;
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    std.debug.print("{any}", .{part2(allocator, "17639 47 3858 0 470624 9467423 5 188")});
}
