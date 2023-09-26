#!/bin/bash

# $1 COMMIT_HASH1 $2 COMMIT_HASH2
# $1 COMMIT_HASH_ON_HEAD $2 COMMIT_HASH_ON_BASE
# order of commit hash in git diff matters
# Base branch (main/dev) should be first and Head branch (staging/feat) should be 2nd

# git diff errors:
# fatal: bad object
# fatal: ambiguous argument '1023de9033dsadsadsdasd': unknown revision or path not in the working tree

# if git diff and/or grep error, it could be that there was no match (meaning no db changes) or a force push was executed (resulting in a non-existent commit prior to the push)

output=$(eval "git diff --name-only --diff-filter=ACMRT $2 $1 | grep -ow schema.prisma$ || true" 2>&1)
exit_status=$?

echo "exit code: $exit_status"
echo "output of git diff: ${output}"

if [ "$output" == "schema.prisma" ]; then
  DB_CHANGES=true
  ERROR=false
else
  output_error=`echo $output | grep -w "fatal" || true 2>&1`
  echo "output_error: $output_error"
  if [ -n "$output_error" ]; then
    ERROR=true
    DB_CHANGES=""
  else
    ERROR=false
    DB_CHANGES=false
  fi
fi

# echo "DB_CHANGES: $DB_CHANGES"
# echo "ERROR: $ERROR"