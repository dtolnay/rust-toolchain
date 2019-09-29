# `rust-toolchain` Action

![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)
[![Gitter](https://badges.gitter.im/actions-rs/community.svg)](https://gitter.im/actions-rs/community)

This GitHub Action installs [Rust toolchain](https://github.com/rust-lang/rustup.rs#toolchain-specification).

Optionally it can set installed toolchain as a default and as an override for current directory.

## Example workflow

```yaml
on: [push]

name: build

jobs:
  check:
    name: Rust project
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Install nightly
        uses: actions-rs/toolchain@v1
        with:
            toolchain: nightly
            override: true

      # `cargo check` command here will use installed `nightly`
      # as it set as an "override" for current directory

      - name: Run cargo check
        uses: actions-rs/cargo@v1
        with:
          command: check
```

See [additional recipes here](https://github.com/actions-rs/meta).

## Inputs

| Name        | Required | Description                                                                                                                            | Type   | Default |
| ------------| :------: | ---------------------------------------------------------------------------------------------------------------------------------------| ------ | --------|
| `toolchain` | ✓        | [Toolchain](https://github.com/rust-lang/rustup.rs#toolchain-specification) name to use, ex. `stable`, `nightly`, `nightly-2019-04-20` | string |         |
| `target`    |          | Additionally install specified target for this toolchain, ex. `x86_64-apple-darwin`                                                    | string |         |
| `default`   |          | Set installed toolchain as a default toolchain                                                                                         | bool   | false   |
| `override`  |          | Set installed toolchain as an override for the current directory                                                                       | bool   | false   |

## Components

If you are going to install `clippy`, `rustfmt` or any other [rustup component](https://rust-lang.github.io/rustup-components-history/),
it might not be available in latest `nightly` build;
check out the [`actions-rs/components-nightly`](https://github.com/actions-rs/components-nightly) Action,
which makes this process much easier.

## Notes

As `rustup` is not installed by default for [macOS environments](https://help.github.com/en/articles/virtual-environments-for-github-actions)
at the moment (2019-09-13), this Action will try its best to install it before any other operations.
