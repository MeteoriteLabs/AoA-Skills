#!/bin/bash
# Bump version in package.json and manifest.json
# Usage: bash scripts/bump-version.sh [patch|minor|major]
#
# Requires: bun, jq

set -e

BUMP_TYPE="${1:-patch}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

CURRENT_VERSION=$(jq -r '.version' "$ROOT_DIR/package.json")
echo "Current version: $CURRENT_VERSION"

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case "$BUMP_TYPE" in
  patch) PATCH=$((PATCH + 1)) ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  *)
    echo "Usage: $0 [patch|minor|major]"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"

# Update package.json
jq ".version = \"$NEW_VERSION\"" "$ROOT_DIR/package.json" > /tmp/pkg.json && mv /tmp/pkg.json "$ROOT_DIR/package.json"

# Update manifest.json
jq ".version = \"$NEW_VERSION\"" "$ROOT_DIR/manifest.json" > /tmp/mfst.json && mv /tmp/mfst.json "$ROOT_DIR/manifest.json"

echo "Bumped $CURRENT_VERSION → $NEW_VERSION in package.json and manifest.json"
echo "Run: git add package.json manifest.json && git commit -m \"chore: bump version to $NEW_VERSION\""
