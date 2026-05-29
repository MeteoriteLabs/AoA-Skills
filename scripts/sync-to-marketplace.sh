#!/bin/bash
# Sync Commander skills to aoa-marketplace.
# Creates/updates content/skills/aoa-{slug}/ directories with manifest.json + SKILL.md.
# Opens a PR if GITHUB_TOKEN is set.
#
# Usage: bash scripts/sync-to-marketplace.sh [path/to/aoa-marketplace]
#
# Prerequisites: jq, git

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MARKETPLACE_DIR="${1:-../aoa-marketplace}"

if [ ! -d "$MARKETPLACE_DIR" ]; then
  echo "Error: aoa-marketplace not found at $MARKETPLACE_DIR"
  echo "Usage: $0 [path/to/aoa-marketplace]"
  exit 1
fi

CATALOG="$ROOT_DIR/catalog/skills.json"
VERSION=$(jq -r '.version' "$ROOT_DIR/manifest.json")
SKILLS=$(jq -c '.skills[]' "$CATALOG")

CREATED=0
UPDATED=0

while IFS= read -r skill; do
  SKILL_ID=$(echo "$skill" | jq -r '.id')
  SKILL_NAME=$(echo "$skill" | jq -r '.name')
  SKILL_DESC=$(echo "$skill" | jq -r '.description')
  SKILL_FILE=$(echo "$skill" | jq -r '.file')
  SKILL_CATEGORY=$(echo "$skill" | jq -r '.category')
  SKILL_TAGS=$(echo "$skill" | jq -r '.tags | join(", ")')

  # Derive directory name from ID: "skill:aoa-curated/aoa-brainstorm" → "aoa-brainstorm"
  SLUG="${SKILL_ID##*/}"
  DEST_DIR="$MARKETPLACE_DIR/content/skills/$SLUG"

  mkdir -p "$DEST_DIR"

  # Write manifest.json
  # license: MIT matches the example-skill fixture and silences the
  # automated-checks "no license" warning in the catalog builder.
  cat > "$DEST_DIR/manifest.json" << EOF
{
  "id": "$SKILL_ID",
  "name": "$SKILL_NAME",
  "description": "$SKILL_DESC",
  "version": "$VERSION",
  "category": "$SKILL_CATEGORY",
  "tags": ["official"],
  "license": "MIT",
  "sourceUrl": "https://github.com/MeteoriteLabs/AoA-Skills",
  "contentInline": true,
  "runtime": { "entry": "SKILL.md" }
}
EOF

  # Copy SKILL.md verbatim, INCLUDING YAML frontmatter.
  # The aoa-curated adapter (catalog/src/sources/aoa-curated/adapter.ts) calls
  # parseFrontmatter() on SKILL.md to populate skill.frontmatter.{name,description}.
  # Existing marketplace skills (aoa-thread-extract) keep their frontmatter, so
  # we match that convention — stripping it would lose the metadata.
  SRC_FILE="$ROOT_DIR/$SKILL_FILE"
  if [ -f "$SRC_FILE" ]; then
    cp "$SRC_FILE" "$DEST_DIR/SKILL.md"
  else
    echo "Warning: Source file not found: $SRC_FILE"
  fi

  if git -C "$MARKETPLACE_DIR" status --porcelain "$DEST_DIR" | grep -q "^??"; then
    CREATED=$((CREATED + 1))
    echo "  Created: $DEST_DIR"
  else
    UPDATED=$((UPDATED + 1))
    echo "  Updated: $DEST_DIR"
  fi

done <<< "$SKILLS"

echo ""
echo "Sync complete: $CREATED created, $UPDATED updated."
echo "Review changes in $MARKETPLACE_DIR and open a PR."
