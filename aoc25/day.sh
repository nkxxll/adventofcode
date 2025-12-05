#!/usr/bin/env bash

# Create a new day solution from the template
# Usage: ./day.sh DD (where DD is the day number like 01, 02, etc.)

if [ -z "$1" ]; then
    echo "Usage: $0 <day>"
    echo "Example: $0 01"
    exit 1
fi

cp ./src/bin/NN.rs ./src/bin/"$1".rs
sed -i '' "s/NN/$1/g" ./src/bin/"$1".rs
touch ./input/"$1".txt
echo "Created day $1 solution"

