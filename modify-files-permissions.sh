#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_ROOT="$(git -C "${SCRIPT_DIR}" rev-parse --show-toplevel)"

git -C "${REPOSITORY_ROOT}" config --replace-all core.filemode true

find "${REPOSITORY_ROOT}" \
    \( -name .git -o -name node_modules -o -name target \) -prune -o \
    -type f -exec chmod 600 {} +

find "${REPOSITORY_ROOT}" \
    \( -name .git -o -name node_modules -o -name target \) -prune -o \
    -type d -exec chmod 700 {} +

find "${REPOSITORY_ROOT}" \
    \( -name .git -o -name node_modules -o -name target \) -prune -o \
    \( -type f -path '*/bin/*' -exec chmod 700 {} + \)

find "${REPOSITORY_ROOT}" \
    \( -name .git -o -name node_modules -o -name target \) -prune -o \
    \( -name '*.sh' -type f -exec chmod 700 {} + \)
