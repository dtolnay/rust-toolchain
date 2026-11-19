#!/bin/bash

# Additional historical patch releases are passed by update-revs.sh.
set -euo pipefail

manifest=$(curl --fail --silent --show-error --location \
    https://static.rust-lang.org/dist/channel-rust-stable.toml)
stable=$(printf '%s\n' "$manifest" | awk '
    /^\[pkg.rust\]$/ { rust = 1; next }
    /^\[/ { rust = 0 }
    rust && /^version = "/ { split($0, fields, "\""); split(fields[2], version, " "); print version[1] }
')
if [[ ! $stable =~ ^1\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
    echo "Could not determine the published stable Rust version" >&2
    exit 1
fi

latest_minor=${stable#1.}
latest_patch=${latest_minor#*.}
latest_minor=${latest_minor%.*}

{
    for ((minor = 0; minor <= latest_minor; minor++)); do
        printf '1.%s.0\n' "$minor"
    done
    for release in "$@" "$stable"; do
        if [[ ! $release =~ ^1\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
            echo "Invalid patch release: $release" >&2
            exit 1
        fi
        minor=${release#1.}
        patch=${minor#*.}
        minor=${minor%.*}
        if ((minor < latest_minor || (minor == latest_minor && patch <= latest_patch))); then
            printf '%s\n' "$release"
        fi
    done
} | sort -Vu
