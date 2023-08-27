#!/bin/bash

# $1 COMMIT_HASH1 $2 COMMIT_HASH2

output=$(eval "git diff --name-only --diff-filter=ACMRT $1 $2 | grep -w schema.prisma$" 2>&1)
exit_status=$?

if [ $exit_status -eq 0 ]; then
  DB_CHANGES=true
else
  echo "Error: git diff returned non-zero exit code $exit_status"
  DB_CHANGES=false
fi