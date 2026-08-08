#!/usr/bin/env bash
#
# Install or update the AZMX Agent Skills.
#
#   ./install.sh              all three skills
#   ./install.sh brand        one skill
#   ./install.sh --dry-run    show what would change, touch nothing
#
# Re-running updates in place. Files deleted upstream are removed locally,
# which a plain `cp -r` will not do — that is the whole reason this exists.
#
set -euo pipefail

DEST_ROOT="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

# source directory -> installed skill name (must match the `name:` in SKILL.md)
SKILLS="brand:azmx-brand colab:colab-design majarah:majarah-design"

DRY=0
WANTED=()
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY=1 ;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "unknown flag: $arg" >&2; exit 1 ;;
    *) WANTED+=("$arg") ;;
  esac
done

cd "$(dirname "$0")"

if [ ! -d .git ]; then
  echo "Run this from a clone of the repo, not a downloaded zip." >&2
  exit 1
fi

command -v rsync >/dev/null || { echo "rsync is required." >&2; exit 1; }

mkdir -p "$DEST_ROOT"
echo "Skills directory: $DEST_ROOT"
if [ "$DRY" = 1 ]; then echo "DRY RUN — nothing will be written"; fi
echo

installed=0
for pair in $SKILLS; do
  src="${pair%%:*}"
  name="${pair##*:}"

  if [ ${#WANTED[@]} -gt 0 ]; then
    match=0
    for w in "${WANTED[@]}"; do
      if [ "$w" = "$src" ] || [ "$w" = "$name" ]; then match=1; fi
    done
    if [ "$match" != 1 ]; then continue; fi
  fi

  [ -d "$src" ] || { echo "skip $src — not in this checkout"; continue; }

  dest="$DEST_ROOT/$name"
  action="install"
  if [ -d "$dest" ]; then action="update"; fi

  # --delete keeps the install honest: anything removed upstream goes here too.
  # node_modules and .git are build/VCS noise and never belong in a skill.
  flags=(-a --delete --exclude '.git' --exclude 'node_modules' --itemize-changes)
  if [ "$DRY" = 1 ]; then flags+=(--dry-run); fi

  echo "-- $name  ($action from $src/)"
  changes=$(rsync "${flags[@]}" "$src/" "$dest/" | { grep -v '^\.d\.\.t' || true; })
  if [ -z "$changes" ]; then
    echo "   already up to date"
  else
    printf '%s\n' "$changes" | sed -n '1,40p' | sed 's/^/   /' 
    n=$(echo "$changes" | wc -l | tr -d ' ')
    if [ "$n" -gt 40 ]; then echo "   … and $((n - 40)) more"; fi
  fi
  echo
  installed=$((installed + 1))
done

if [ "$installed" = 0 ]; then
  echo "Nothing matched. Available: brand, colab, majarah" >&2
  exit 1
fi

if [ "$DRY" = 1 ]; then
  echo "Dry run complete. Re-run without --dry-run to apply."
else
  echo "Done. Restart Claude Code, or run /doctor, to pick up the changes."
fi
