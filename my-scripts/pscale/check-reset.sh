#!/bin/bash

# CHECKS IF EITHER PSCALE DB NEEDS TO BE RESET OR OPEN & APPROVED PSCALE DR NEEDS TO BE RECREATED

# if STAGING_BRANCH == "true" then RESET=TRUE whether there are db changes or not

# Github branch is staging
if [ "$STAGING" == "true" ]; then
  if [ "$PR_ACTIVITY_TYPE" == "synchronize" ]; then
    if [[ "$DB_CHANGES_ON_PR_SYNC" == "true" ]]; then
      RESET=true
    elif [[ "$ERROR_DB_CHANGES_ON_PR_SYNC" == "true" && "$DB_CHANGES" == "true" ]]; then
      RESET=true
    else
      RESET=false
    fi

  # not a pr sync event
  else
    RESET=true
  fi

# Github branch is not staging and pr sync event
elif [ "$PR_ACTIVITY_TYPE" == "synchronize" ]; then
  if [[ "$DB_CHANGES_ON_PR_SYNC" == "true" ]]; then
    RESET=true
  # check DB_CHANGES on PR Head vs Base, when there is an error
  elif [[ "$ERROR_DB_CHANGES_ON_PR_SYNC" == "true" && "$DB_CHANGES" == "true" ]]; then
    RESET=true
  else
    RESET=false
  fi

# Github branch is not staging and not a pr sync event
else
  if [ "$DB_CHANGES" == "true" ]; then
    RESET=true
  else
    RESET=false
  fi
fi

echo "RESET: ${RESET}"
echo "RESET=${RESET}" >> "$GITHUB_OUTPUT"