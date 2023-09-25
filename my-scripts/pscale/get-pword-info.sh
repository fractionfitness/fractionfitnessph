#!/bin/bash

# GET PWORD ID

# $1 PSCALE_DB_NAME $2 PSCALE_BRANCH_NAME $3 PSCALE_ORG_NAME $4 PSCALE_PWORD_NAME

# output will be empty if there is an error message when executing "pscale password list" (i.e. nonexistent branch) but exit status is still 0, even with error message
output=`pscale password list $1 $2 --org $3 --format json | jq -r "[.[] | select(.name == \"$4\") ]  | .[0].id " `

if [[ "${output}" == "null" || "${output}" == "" ]]; then
  export PWORD_ID=""
  export PWORD_NAME=""
else
  export PWORD_ID="$output"
  export PWORD_NAME="$4"
fi

echo "output: $output"
echo "PWORD_NAME: $PWORD_NAME"
echo "PWORD_ID: $PWORD_ID"