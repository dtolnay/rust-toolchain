#!/bin/bash

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

if ! git diff-index --quiet HEAD; then
    echo "Not running update-revs.sh because git working directory is dirty" >&2
    exit 1
fi

if ! grep -q "#default: \${{ rev }}" action.yml; then
    echo "Not running update-revs.sh because action.yml looks wrong" >&2
    exit 1
fi

base=$(git rev-parse HEAD)
git checkout --quiet "$base"

for rev in 1.{0..43}.0 stable beta nightly; do
    echo "Updating $rev branch"
    git branch --quiet --delete --force $rev &>/dev/null || true
    sed -i "s/#default: \${{ rev }}/default: $rev/" action.yml
    git add action.yml
    git commit --quiet --message "toolchain: $rev"
    git checkout --quiet -b $rev
    git checkout --quiet "$base"
done
