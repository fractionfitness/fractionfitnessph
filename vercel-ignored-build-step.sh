#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

echo "VERCEL_GIT_PULL_REQUEST_ID: $VERCEL_GIT_PULL_REQUEST_ID"

echo "NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID: $NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID"

# ref: https://www.baeldung.com/linux/environment-variable-check-if-set
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

if [[ ! -n "${VERCEL_GIT_PULL_REQUEST_ID}" ]] ; then
    echo "vercel pr id has no value"
  else
    echo "vercel pr id has value"
fi

# checks git branch
# if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "dev" || "$VERCEL_GIT_COMMIT_REF" == "cicd-test" ]] ; then

# checks git branch or PULL_REQUEST_ID on any branch | PRs on main/staging/dev are excluded since their deployments will proceed when commits are pushed, cancelling the deployment on PR
# If a deployment is created on a branch before a pull request is made, VERCEL_GIT_PULL_REQUEST_ID value will be an empty string.
# ref: https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables

# only works if a pull request has already been opened for the feat branch beforehand and another commit has been pushed after the opened PR
# ref: https://vercel.com/docs/concepts/deployments/preview-deployments
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "dev" || x"${VERCEL_GIT_PULL_REQUEST_ID}" != "x" ]] ; then
  # Proceed with the build
    echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi