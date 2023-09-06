#!/bin/bash

# $1 COMMIT_HASH1 $2 COMMIT_HASH2

# git diff errors:
# fatal: bad object
# fatal: ambiguous argument '1023de9033dsadsadsdasd': unknown revision or path not in the working tree

# if git diff and/or grep error, it could be that there was no match (meaning no db changes) or a force push was executed (resulting in a non-existent commit prior to the push)

output=$(eval "git diff --name-only --diff-filter=ACMRT $1 $2 | grep -ow schema.prisma$ || true" 2>&1)
exit_status=$?

echo "exit code: $exit_status"
echo "output of git diff: ${output}"

if [ "$output" == "schema.prisma" ]; then
  DB_CHANGES=true
  ERROR=false
else
  output_error=`echo $output | grep -w "fatal" `
  if [ -n "$output_error" ]; then
    echo "output_error: $output_error"
    ERROR=true
    DB_CHANGES=""
  else
    ERROR=false
    DB_CHANGES=false
  fi
fi

# echo "DB_CHANGES: $DB_CHANGES"
# echo "ERROR: $ERROR"