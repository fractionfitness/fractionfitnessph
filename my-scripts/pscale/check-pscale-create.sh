#!/bin/bash

if [ "$DB_CHANGES" == "true" ]; then
  if [[ "$PSCALE_BRANCH_EXISTS" == "false" || "$EXISTING_PWORD_ID" == "" || "$EXISTING_PWORD_CACHE_HIT" != "true" || "$DR_EXISTS" != "true" ]]; then
    RUN_PSCALE_CREATE=true
  elif [ "$DR_EXISTS" == "true" ]; then
    if [[ "$DR_STATE" == "closed" || "$DR_APPROVED" == "Yes" ]]; then
      RUN_PSCALE_CREATE=true
    else
      RUN_PSCALE_CREATE=false
    fi
  else
    RUN_PSCALE_CREATE=false
  fi
# if no DB changes and is staging branch
elif [ "$STAGING" == "true" ]; then
  if [[ "$PSCALE_BRANCH_EXISTS" == "false" || "$EXISTING_PWORD_ID" == "" || "$EXISTING_PWORD_CACHE_HIT" != "true" ]]; then
    RUN_PSCALE_CREATE=true
  else
    RUN_PSCALE_CREATE=false
  fi
else
  RUN_PSCALE_CREATE=false
fi

echo "RUN_PSCALE_CREATE: $RUN_PSCALE_CREATE"
echo "RUN_PSCALE_CREATE=${RUN_PSCALE_CREATE}" >> "$GITHUB_OUTPUT"