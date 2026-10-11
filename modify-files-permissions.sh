#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# Constants/Variables

# Entries use 'octal-mode:literal-file-path', relative to this script.
# Ignored paths take precedence over these permissions.
CUSTOM_FILE_PERMISSIONS=(
    # '700:tools/my-command'
)

# Literal paths relative to this script; directories exclude their entire subtree.
CUSTOM_IGNORED_PATHS=(
    # 'shared-data/'
)

# Functions
escape_find_path() {
    FIND_PATTERN="${1#./}"
    FIND_PATTERN="${FIND_PATTERN%/}"
    FIND_PATTERN="${FIND_PATTERN//\\/\\\\}"
    FIND_PATTERN="${FIND_PATTERN//\*/\\*}"
    FIND_PATTERN="${FIND_PATTERN//\?/\\?}"
    FIND_PATTERN="${FIND_PATTERN//\[/\\[}"
    FIND_PATTERN="./${FIND_PATTERN}"
}

# Run
IGNORED_PATHS_FILE="$(mktemp)"
trap 'rm -f -- "${IGNORED_PATHS_FILE}"' EXIT
git ls-files --others --ignored --exclude-standard --directory -z >"${IGNORED_PATHS_FILE}"
mapfile -d '' -t GIT_IGNORED_PATHS <"${IGNORED_PATHS_FILE}"

PRUNE_ARGS=(-path './.git')
for path in "${GIT_IGNORED_PATHS[@]}" "${CUSTOM_IGNORED_PATHS[@]}"; do
    escape_find_path "${path}"
    PRUNE_ARGS+=(-o -path "${FIND_PATTERN}")
done

PERMISSION_ARGS=()
for entry in "${CUSTOM_FILE_PERMISSIONS[@]}"; do
    mode="${entry%%:*}"
    path="${entry#*:}"
    if [[ "${entry}" != *:* || ! "${mode}" =~ ^[0-7]{3,4}$ || -z "${path}" ]]; then
        printf 'Invalid custom file permission: %s\n' "${entry}" >&2
        exit 1
    fi

    escape_find_path "${path}"
    PERMISSION_ARGS+=(\( -type f -path "${FIND_PATTERN}" -exec chmod "${mode}" {} + \) -o)
done

git config --replace-all core.filemode true
find . \( "${PRUNE_ARGS[@]}" \) -prune -o \
    "${PERMISSION_ARGS[@]}" \
    \( -type d -exec chmod 700 {} + \) -o \
    \( -type f -name '*.sh' -exec chmod 700 {} + \) -o \
    \( -type f -exec chmod 600 {} + \)
