const std = @import("std");

const test_input = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

const input = "3737332285-3737422568,5858547751-5858626020,166911-236630,15329757-15423690,753995-801224,1-20,2180484-2259220,24-47,73630108-73867501,4052222-4199117,9226851880-9226945212,7337-24735,555454-591466,7777695646-7777817695,1070-2489,81504542-81618752,2584-6199,8857860-8922218,979959461-980003045,49-128,109907-161935,53514821-53703445,362278-509285,151-286,625491-681593,7715704912-7715863357,29210-60779,3287787-3395869,501-921,979760-1021259";

fn isRepeated(number: usize) bool {
    var buf: [24]u8 = undefined;
    const len = std.fmt.printInt(&buf, number, 10, std.fmt.Case.lower, .{});
    const num_string = buf[0..len];
    if (num_string.len % 2 != 0) return false;
    const middle = num_string.len / 2;
    for (0..middle) |idx| {
        if (num_string[idx] != num_string[middle + idx]) return false;
    }
    return true;
}

pub fn main() !void {
    var split = std.mem.splitScalar(u8, input, ',');
    var sum: usize = 0;
    while (split.next()) |range| {
        var numbers = std.mem.splitScalar(u8, range, '-');
        const first = try std.fmt.parseInt(usize, numbers.next().?, 10);
        const second = try std.fmt.parseInt(usize, numbers.next().?, 10);
        for (first..second + 1) |number| {
            if (isRepeated(number)) sum += number;
        }
    }
    std.debug.print("***{d}***\n", .{sum});
}
