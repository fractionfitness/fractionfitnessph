#!/bin/bash

# $1 DB $2 BRANCH $3 ORG

# Check if branch deploy request already exists

#  only store matching line to output var | w/o grep cmd will result in column names and matching line to be stored to output (all in one line and not in separate rows) | also makes it harder to get DR_NUMBER
# only gets last deploy request for the branch (even if there are many closed and not deployed/complete requests)
output=$(eval " pscale deploy-request show $1 $2 --org $3 | grep -w \"$2[ $]\" " 2>&1)
exit_status=$?
echo "output of pscale password list: ${output}"

if [ $exit_status -eq 0 ]; then
  echo "Deploy Request exists on Planetscale $1 (Database) $2 (Branch)"
  EXISTS=true

  DR_NUMBER=$(eval " echo ${output} | awk -F' ' '{print \$2}' ")
  DR_STATE=$(eval " echo ${output} | awk -F' ' '{print \$6}' ")
  DR_DEPLOY_STATE=$(eval " echo ${output} | awk -F' ' '{print \$7}' ")

else
  echo "Deploy Request does not exist on Planetscale $1 (Database) $2 (Branch)"
  EXISTS=false
fi

echo "PSCALE_DR_EXISTS: ${EXISTS}"
echo "PSCALE_DR_NUMBER: ${DR_NUMBER}"
echo "PSCALE_DR_STATE: ${DR_STATE}"
echo "PSCALE_DR_DEPLOY_STATE: ${DR_DEPLOY_STATE}"
echo "PSCALE_DR_EXISTS=${EXISTS}" >> "${GITHUB_OUTPUT}"
echo "PSCALE_DR_NUMBER=${DR_NUMBER}" >> "${GITHUB_OUTPUT}"
echo "PSCALE_DR_STATE=${DR_STATE}" >> "${GITHUB_OUTPUT}"
echo "PSCALE_DR_DEPLOY_STATE=${DR_DEPLOY_STATE}" >> "${GITHUB_OUTPUT}"
