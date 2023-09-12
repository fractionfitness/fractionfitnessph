#!/bin/bash

if [ "$PR_ACTIVITY_TYPE" == "synchronize" ]; then
  if [[ "$DB_CHANGES_ON_PR_SYNC" == "true" ]]; then
    RESET_DB=true
  # check DB_CHANGES on PR Head vs Base, when there is an error
  elif [[ "$ERROR_DB_CHANGES_ON_PR_SYNC" == "true" && "$DB_CHANGES" == "true" ]]; then
    RESET_DB=true
  else
    RESET_DB=false
  fi
else
  if [ "$DB_CHANGES" == "true" ]; then
    RESET_DB=true
  else
    RESET_DB=false
  fi
fi

echo "RESET_DB: ${RESET_DB}"
echo "RESET_DB=${RESET_DB}" >> $GITHUB_OUTPUT