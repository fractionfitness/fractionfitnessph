#!/bin/bash

# $1 COMMIT_HASH1 $2 COMMIT_HASH2

output=$(eval "git diff --name-only --diff-filter=ACMRT $1 $2 | grep -w schema.prisma$" 2>&1)
exit_status=$?

#  this doesn't run if exit_status != 0
echo "exit code: $exit_status"

if [ $exit_status -eq 0 ]; then
  DB_CHANGES=true
else
  DB_CHANGES=false
fi