#!/bin/bash

# CHECKS IF EITHER PSCALE DB NEEDS TO BE RESET OR OPEN & APPROVED PSCALE DR NEEDS TO BE RECREATED

if [ "$PR_ACTIVITY_TYPE" == "synchronize" ]; then
  if [[ "$DB_CHANGES_ON_PR_SYNC" == "true" ]]; then
    RESET=true
  # check DB_CHANGES on PR Head vs Base, when there is an error
  elif [[ "$ERROR_DB_CHANGES_ON_PR_SYNC" == "true" && "$DB_CHANGES" == "true" ]]; then
    RESET=true
  else
    RESET=false
  fi
else
  if [ "$DB_CHANGES" == "true" ]; then
    RESET=true
  else
    RESET=false
  fi
fi

echo "RESET: ${RESET}"
echo "RESET=${RESET}" >> "$GITHUB_OUTPUT"