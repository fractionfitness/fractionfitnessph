#!/bin/bash

# $1 DB $2 BRANCH $3 ORG

# Check if branch deploy request already exists

#  only store matching line to output var | w/o grep cmd will result in column names and matching line to be stored to output (all in one line and not in separate rows) | also makes it harder to get NUMBER
# output includes deploy requests that are already 'closed'
# only gets last deploy request for the branch (even if there are many closed and not deployed/complete requests)
output=$(eval " pscale deploy-request show $1 $2 --org $3 | grep -w \"$2[ $]\" " 2>&1)
exit_status=$?
echo "output of pscale password list: ${output}"

if [ $exit_status -eq 0 ]; then
  echo "Deploy Request exists on Planetscale $1 (Database) $2 (Branch)"
  EXISTS=true

  NUMBER=$(eval " echo ${output} | awk -F' ' '{print \$2}' ")
  BRANCH=$(eval " echo ${output} | awk -F' ' '{print \$3}' ")
  INTO_BRANCH=$(eval " echo ${output} | awk -F' ' '{print \$4}' ")
  APPROVED=$(eval " echo ${output} | awk -F' ' '{print \$5}' ")
  STATE=$(eval " echo ${output} | awk -F' ' '{print \$6}' ")
  DEPLOY_STATE=$(eval " echo ${output} | awk -F' ' '{print \$7}' ")
  DEPLOYABLE=$(eval " echo ${output} | awk -F' ' '{print \$8}' ")

  # check if deploy request is 'open' or 'closed'
  # if [ "${STATE}" == 'open' ]; then
  # fi

else
  echo "Deploy Request does not exist on Planetscale $1 (Database) $2 (Branch)"
  EXISTS=false
fi

echo "DR_EXISTS: ${EXISTS}"
echo "DR_NUMBER: ${NUMBER}"
echo "DR_BRANCH: ${BRANCH}"
echo "DR_INTO_BRANCH: ${INTO_BRANCH}"
echo "DR_APPROVED: ${APPROVED}"
echo "DR_STATE: ${STATE}"
echo "DR_DEPLOY_STATE: ${DEPLOY_STATE}"
echo "DR_DEPLOYABLE: ${DEPLOYABLE}"

echo "DR_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"
echo "DR_NUMBER=${NUMBER}" >> "${GITHUB_OUTPUT}"
echo "DR_BRANCH=${BRANCH}" >> "${GITHUB_OUTPUT}"
echo "DR_INTO_BRANCH=${INTO_BRANCH}" >> "${GITHUB_OUTPUT}"
echo "DR_APPROVED=${APPROVED}" >> "${GITHUB_OUTPUT}"
echo "DR_STATE=${STATE}" >> "${GITHUB_OUTPUT}"
echo "DR_DEPLOY_STATE=${DEPLOY_STATE}" >> "${GITHUB_OUTPUT}"
echo "DR_DEPLOYABLE=${DEPLOYABLE}" >> "${GITHUB_OUTPUT}"
