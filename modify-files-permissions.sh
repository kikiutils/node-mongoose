#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR

REPO_ROOT="$(git -C "${SCRIPT_DIR}" rev-parse --show-toplevel)"
readonly REPO_ROOT

# Functions
apply_permissions() {
    local directory="$1"
    local entry relative_path

    chmod 700 "${directory}"

    for entry in "${directory}"/*; do
        [[ "${entry##*/}" == '.git' ]] && continue
        relative_path="${entry#"${REPO_ROOT}"/}"

        if git -C "${REPO_ROOT}" check-ignore --quiet --no-index -- "${relative_path}"; then
            continue
        fi

        if [[ -L "${entry}" ]]; then
            continue
        elif [[ -d "${entry}" ]]; then
            apply_permissions "${entry}"
        elif [[ -f "${entry}" ]]; then
            chmod 600 "${entry}"
        fi
    done
}

# Run
git -C "${REPO_ROOT}" config --replace-all core.filemode true
shopt -s dotglob nullglob
apply_permissions "${REPO_ROOT}"
find "${REPO_ROOT}" -name .git -prune -o \
    \( -name '*.sh' -type f -exec chmod 700 {} + \)
