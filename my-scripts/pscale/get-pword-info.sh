#!/bin/bash

# GET PWORD ID

# $1 PSCALE_DB_NAME $2 PSCALE_BRANCH_NAME $3 PSCALE_ORG_NAME $4 PSCALE_PWORD_NAME


PWORD_ID=`pscale password list $1 $2 --org $3 --format json | jq -r "[.[] | select(.name == \"$4\") ]  | .[0].id "`

if [ "${output}" != null ]; then
  export PWORD_ID="${PWORD_ID}"
  export PWORD_NAME=$4
else
  export PWORD_ID=""
  export PWORD_NAME=""
fi
