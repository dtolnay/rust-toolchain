# `rustup toolchain` Action

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
        uses: actions-rs/toolchain@1
        with:
            toolchain: nightly
            override: true
```

## Inputs

* `toolchain` (*required*): Toolchain name, see [rustup page](https://github.com/rust-lang/rustup.rs#toolchain-specification) for details.\
  Examples: `stable`, `nightly`, `nightly-2019-04-20`
* `target`: Additionally install specific target for this toolchain (ex. `x86_64-apple-darwin`)
* `default`: Set installed toolchain as default (executes `rustup toolchain default {TOOLCHAIN}`)
* `override`: Set installed toolchain as an override for current directory

## Notes

As `rustup` is not installed by default for macOS and Windows images at the moment (2019-09-13),
this Action will try its best to install it before any other operations.
