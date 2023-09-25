#!/bin/bash

if [[ "$EXISTS" == "true" && "$STATE" == "open" && "$APPROVED" == "Yes" && "$DEPLOY_STATE" == "ready" && "$DEPLOYABLE" == "Yes" ]]; then
  echo "Planetscale Deploy Request is already Approved and ready for Deployment"
  DEPLOY_DR="true"
  # no need to approve an already approved DR
  APPROVE_DR="false"

elif [[ "$EXISTS" == "true" && "$STATE" == "open" && "$APPROVED" == "No" && "$DEPLOY_STATE" == "ready" && "$DEPLOYABLE" == "Yes" ]]; then
  echo "Planetscale Deploy Request is ready for Approval."
  DEPLOY_DR="true"
  APPROVE_DR="true"

else
  echo "Resolve the following Planetscale Deploy Request Issues:"
  if [ "$EXISTS" != "true" ]; then
    echo "Deploy Request does not exist yet. Please create one."

  elif [ "$STATE" == "closed" ]; then
    echo "Existing Deploy Requests are all Closed. Please create a new one."

  else
    # DR is open
    if [ "$APPROVED" != "Yes" ]; then
      echo "Open Deploy Request has not yet been Approved"
    fi

    if [ "$DEPLOY_STATE" == "no_changes" ]; then
      echo "Open Deploy Request does not have any changes. Please push schema changes to the Planetscale Branch."
    elif [ "$DEPLOY_STATE" != "ready" ]; then
      echo "Open Deploy Request state is not equal to \"ready\". "
    fi

    if [ "$DEPLOYABLE" != "Yes" ]; then
      echo "Open Deploy Request is not Deployable"
    fi
  fi

  # This doesn't matter since exit 1 will terminate the shell
  # DEPLOY_DR="false"
  # APPROVE_DR="false"
  exit 1
fi

echo "DEPLOY_DR: ${DEPLOY_DR}"
echo "APPROVE_DR: ${APPROVE_DR}"
echo "DEPLOY_DR=${DEPLOY_DR}" >> "${GITHUB_OUTPUT}"
echo "APPROVE_DR=${APPROVE_DR}" >> "${GITHUB_OUTPUT}"