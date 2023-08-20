#!/bin/bash

# GET EXISTING PWORD ID

# $1 PSCALE_DB_NAME $2 PSCALE_BRANCH_NAME $3 PSCALE_ORG_NAME $4 PSCALE_PWORD_NAME


PWORD_ID=`pscale password list $1 $2 --org $3 --format json | jq -r "[.[] | select(.name == \"$4\") ]  | .[0].id "`

if [ "${output}" != null ]; then
  export EXISTING_PWORD_ID="${PWORD_ID}"
fi

echo "EXISTING_PWORD_ID=${EXISTING_PWORD_ID}" >> $GITHUB_OUTPUT
echo "EXISTING_PWORD_NAME=${PSCALE_PWORD_NAME}" >> $GITHUB_OUTPUT

# CREATE BRANCH PASSWORD NAME
# $1 PSCALE_DB_NAME $2 PSCALE_BRANCH_NAME $3 PSCALE_ORG_NAME $4 ROLE

# EXISTING_PWORD_ID=`pscale password list ${{ env.PSCALE_DB_NAME }} ${{ env.PSCALE_BRANCH_NAME }} --org ${{ env.PSCALE_ORG_NAME }} --format json | jq -r "[.[] | select(.name == \"${{ env.PSCALE_PWORD_NAME }}\") ]  | .[0].id "`

# if [ "${4}" != null ]; then
#   echo "PSCALE_PWORD_NAME: ${PSCALE_BRANCH_NAME}-${ROLE}"
#   echo "PSCALE_PWORD_NAME=${PSCALE_BRANCH_NAME}-${ROLE}" >> "${GITHUB_OUTPUT}"
# fi