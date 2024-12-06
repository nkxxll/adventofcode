#!/usr/bin/env bash

days=$(find . -name "day*" -type d | sort)
testFlag=false

while test $# -gt 0; do
    case "$1" in
        "--test") testFlag=true ;;
        "-t") testFlag=true ;;
        *) print_usage
            exit 1 ;;
    esac
    shift
done

for day in $days; do
    echo "Day: $day"
    if $testFlag; then
        cd "$day" || exit
        bun run "$day.ts" --part 1 --input "./test_input.txt" && bun run "$day.ts" --part 2 --input "./test_input.txt"
        cd ..
    else
        cd "$day" || exit
        bun run "$day.ts" --part 1 && bun run "$day.ts" --part 2
        cd ..
    fi
done
