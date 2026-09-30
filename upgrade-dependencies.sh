#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

[[ " $@ " =~ ' -c ' ]] && rm -rf ./node_modules ./pnpm-lock.yaml

pnpm upgrade -L
pnpm add -D typescript@^6.0.3
./modify-files-permissions.sh
