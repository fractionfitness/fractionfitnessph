#!/bin/bash

if [ "$EXISTS" != "true" ]: then
  echo "Planetscale Deploy Request does not exist yet..."
elif [[ "$EXISTS" == "true" && "$STATE" == "open" && "$APPROVED" == "Yes" && "$DEPLOYMENT_STATE" == "ready" && "$DEPLOYABLE" == "Yes" ]]; then
  echo "Planetscale Deploy Request is ready for Deployment"
  exit 0
else
  echo "Resolve the following Planetscale Deploy Request Issues:"
  if [ "$STATE" == "closed" ]; then
    echo "No Open Deploy Request"
  fi

  if [ "$APPROVED" != "Yes" ]; then
    echo "Deploy Request has not yet been Approved"
  fi

  if [ "$DEPLOYMENT_STATE" != "ready" ]; then
    echo "Deploy Request state is not equal to \"ready\" or state is equal to \"no_changes\" (meaning no DB schema changes)."
  fi

  if [ "$DEPLOYABLE" != "Yes" ]; then
    echo "Deploy Request is not Deployable"
  fi
  exit 1
fi