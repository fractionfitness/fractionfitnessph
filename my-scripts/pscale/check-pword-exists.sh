#!/bin/bash

# $1 DB $2 BRANCH $3 ORG $4 PWORD_NAME

# Check if branch pword already exists
output=$(eval " pscale password list $1 $2 --org $3 | grep -o \"$4[ $]\" " 2>&1)
exit_status=$?
echo "output of pscale password list: ${output}"
if [ $exit_status -eq 0 ]; then
  echo "$3 (Password) exists on Planetscale $1 (Database) $2 (Branch) "
  EXISTS=true
else
  echo "$3 (Password) does not exist on Planetscale $1 (Database) $2 (Branch) "
  EXISTS=false
fi

echo "PSCALE_BRANCH_PWORD_EXISTS: ${EXISTS}"
echo "PSCALE_BRANCH_PWORD_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"
