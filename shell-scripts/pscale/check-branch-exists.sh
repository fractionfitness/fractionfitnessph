#!/bin/bash

# $1 DB $2 BRANCH $3 ORG

# Check if branch already exists
output=$(eval "pscale branch show $1 $2 --org $3 --service-token-id $4 --service-token $5" 2>&1)
exit_status=$?
echo "output of pscale branch show: ${output}"
if [ $exit_status -eq 0 ]; then
  echo "$2 (Branch) exists on Planetscale $3 (Org) $1 (Database)"
  EXISTS=true
else
  echo "$2 (Branch) does not exist on Planetscale $3 (Org) $1 (Database)"
  EXISTS=false
fi

echo "PSCALE_BRANCH_EXISTS: ${EXISTS}"
echo "PSCALE_BRANCH_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"
