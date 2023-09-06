#!/bin/bash

# $1 DB $2 ORG $3 BRANCH_NAME

# Check how many branches in pscale account | if = 2, then echo "delete pscale branch and re-run workflow" then exit 1 | workflow must fail so that vercel deployment also fails

# Check if branch already exists
# output=null if no branch found
output=`pscale branch list $1 --org $2 --format json | jq -r "[.[] | select(.name == \"$3\") ] | .[0].name" `
if [ "$output" != "null" ]; then
  EXISTS=true
else
  EXISTS=false
fi
echo "PSCALE_BRANCH_EXISTS: ${EXISTS}"
echo "PSCALE_BRANCH_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"

# this will produce an error if no branch is found
# output=$(eval "pscale branch show $1 $2 --org $3 --service-token-id $4 --service-token $5" 2>&1)
# exit_status=$?
# echo "output of pscale branch show: ${output}"
# if [ $exit_status -eq 0 ]; then
#   echo "$2 (Branch) exists on Planetscale $3 (Org) $1 (Database)"
#   EXISTS=true
#   exit 0
# else
#   echo "$2 (Branch) does not exist on Planetscale $3 (Org) $1 (Database)"
#   EXISTS=false
#   exit 1
# fi

# echo "PSCALE_BRANCH_EXISTS: ${EXISTS}"
# echo "PSCALE_BRANCH_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"
