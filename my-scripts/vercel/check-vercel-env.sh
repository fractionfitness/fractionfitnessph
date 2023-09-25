#!/bin/bash

# $1 VERCEL_ENV $2 GITHUB_BRANCH_NAME $3 VERCEL_TOKEN $4 VERCEL_ENV_VAR

output=`vercel env ls $1 $2 --token $3 | grep -ow $4 || true 2>&1`

echo "output: ${output}"

if [ "$output" == "$4" ]; then
  EXISTS=true
else
  EXISTS=false
fi