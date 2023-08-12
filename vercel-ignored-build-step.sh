#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

echo "VERCEL_GIT_PULL_REQUEST_ID: $VERCEL_GIT_PULL_REQUEST_ID"

echo "NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID: $NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID"

if [ x"${VERCEL_GIT_PULL_REQUEST_ID}" == "x" ] ; then
    echo "vercel pr id has no value"
  else
    echo "vercel pr id has value"
fi

if [ ${VERCEL_GIT_PULL_REQUEST_ID:-"unset"} == "unset" ] ; then
    echo "vercel pr id has no value"
  else
    echo "vercel pr id has value"
fi

if [[ -z "${VERCEL_GIT_PULL_REQUEST_ID}" ]] ; then
    echo "vercel pr id has no value"
  else
    echo "vercel pr id has value"
fi

# checks git branch
# if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "cicd-test" ]] ; then

# checks git branch or PULL_REQUEST_ID on any branch | PRs on main/staging/dev are excluded since their deployments will proceed when commits are pushed cancelling the deployment on PR
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "dev" || x"${VERCEL_GIT_PULL_REQUEST_ID}" != "x" ]] ; then
  # Proceed with the build
    echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi