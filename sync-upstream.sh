#!/bin/bash
# Manual sync script - pulls latest changes from the upstream repository
# Usage: ./sync-upstream.sh

set -e

UPSTREAM_URL="https://github.com/yansan0000-netizen/calculatorkp.git"

# Add upstream remote if not exists
if ! git remote | grep -q upstream; then
  git remote add upstream "$UPSTREAM_URL"
  echo "Added upstream remote: $UPSTREAM_URL"
fi

echo "Fetching upstream..."
git fetch upstream

echo "Merging upstream/main..."
if git merge upstream/main --allow-unrelated-histories --no-edit; then
  echo "Sync complete! Changes merged successfully."
else
  echo "Merge conflicts detected. Resolve them manually, then commit."
  exit 1
fi
