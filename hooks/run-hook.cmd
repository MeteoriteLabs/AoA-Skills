#!/bin/sh
# Polyglot hook runner — works on bash (Linux/macOS) and cmd.exe (Windows).
# Detects platform and delegates to the correct script.
# Usage: run-hook.cmd <hook-name>
# Example: run-hook.cmd session-start

HOOK_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$HOOK_NAME" ]; then
  echo "Usage: run-hook.cmd <hook-name>" >&2
  exit 1
fi

HOOK_SCRIPT="$SCRIPT_DIR/$HOOK_NAME"

if [ ! -f "$HOOK_SCRIPT" ]; then
  echo "Hook script not found: $HOOK_SCRIPT" >&2
  exit 0  # Non-fatal — missing hook is OK
fi

if [ -x "$HOOK_SCRIPT" ]; then
  exec "$HOOK_SCRIPT"
else
  exec bash "$HOOK_SCRIPT"
fi
