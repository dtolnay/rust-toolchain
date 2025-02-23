#!/bin/bash

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

if ! git diff-index --quiet HEAD; then
    echo "Not running update-revs.sh because git working directory is dirty" >&2
    exit 1
fi

patch_releases=(
    1.12.1 1.15.1 1.22.1 1.24.1 1.26.1 1.26.2 1.27.1 1.27.2 1.29.1 1.29.2 1.30.1
    1.31.1 1.34.1 1.34.2 1.41.1 1.43.1 1.44.1 1.45.1 1.45.2 1.52.1 1.56.1 1.58.1
    1.62.1 1.66.1 1.67.1 1.68.1 1.68.2 1.71.1 1.72.1 1.74.1 1.77.1 1.77.2 1.80.1
    1.84.1 1.85.0
)

releases() {
    printf "%s\n" 1.{0..90}.0 ${patch_releases[@]} | sort -V
}

base=$(git rev-parse HEAD)
push=()

declare -A minor
for rev in `releases`; do
    minor[${rev%.*}]=$rev
done

for rev in `releases` stable beta nightly; do
    echo "Updating $rev branch"
    git checkout --quiet "$base"
    git branch --quiet --delete --force $rev &>/dev/null || true
    if [[ $rev == 1* ]]; then
        sed -i "/^  toolchain:/,+2d; s/\${{inputs\.toolchain}}/$rev/" action.yml
    else
        sed -i "s/required: true/required: false\n    default: $rev/" action.yml
    fi
    git add action.yml
    git commit --quiet --message "toolchain: $rev"
    git checkout --quiet -b $rev
    push+=("$rev:refs/heads/$rev")
    if [ "${minor[${rev%.*}]}" == $rev ]; then
        push+=("$rev:refs/heads/${rev%.*}")
    fi
done

for tool in clippy miri; do
    echo "Updating $tool branch"
    git checkout --quiet --detach nightly
    git branch --quiet --delete --force $tool &>/dev/null || true
    default=$tool
    if [ $tool == miri ]; then default+=,\ rust-src; fi
    sed -i "/required: false/{N;s/\n$/\n    default: $default\n/}" action.yml
    git add action.yml
    git commit --quiet --message "components: $tool"
    git checkout --quiet -b $tool
    push+=("$tool:refs/heads/$tool")
done

git checkout --quiet "$base"

echo "git push origin --force-with-lease ${push[@]}"
