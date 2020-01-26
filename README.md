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
      - name: Install latest nightly
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

| Name         | Required | Description                                                                                                                                         | Type   | Default |
| ------------ | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------| ------ | --------|
| `toolchain`  | ✓        | [Toolchain](https://github.com/rust-lang/rustup.rs#toolchain-specification) name to use, ex. `stable`, `nightly`, `nightly-2019-04-20`, or `1.32.0` | string |         |
| `target`     |          | Additionally install specified target for this toolchain, ex. `x86_64-apple-darwin`                                                                 | string |         |
| `default`    |          | Set installed toolchain as a default toolchain                                                                                                      | bool   | false   |
| `override`   |          | Set installed toolchain as an override for the current directory                                                                                    | bool   | false   |
| `profile`    |          | Execute `rustup set profile {value}` before installing the toolchain, ex. `minimal`                                                                 | string |         |
| `components` |          | Comma-separated list of the additional components to install, ex. `clippy, rustfmt`                                                                 | string |         |

## Outputs

Installed `rustc`, `cargo` and `rustup` versions can be fetched from the Action outputs:

| Name         | Description           | Example                         |
| ------------ | --------------------- | ------------------------------- |
| `rustc`      | Rustc version         | `1.40.0 (73528e339 2019-12-16)` |
| `rustc-hash` | Rustc version hash    | `73528e339`                     |
| `cargo`      | Cargo version         | `1.40.0 (bc8e4c8be 2019-11-22)` |
| `rustup`     | rustup version        | `1.21.1 (7832b2ebe 2019-12-20)` |

Note: `rustc-hash` output value can be used with [actions/cache](https://github.com/actions/cache) Action
to store cache for different Rust versions, as it is unique across different Rust versions and builds (including `nightly`).

## Profiles

This Action supports rustup [profiles](https://blog.rust-lang.org/2019/10/15/Rustup-1.20.0.html#profiles),
which are can be used to speed up the workflow execution by installing the
minimally required set of components, for example:

```yaml
- name: Install minimal nightly
  uses: actions-rs/toolchain@v1
  with:
    profile: minimal
    toolchain: nightly
```

This Action will automatically run `rustup self update` if `profile` input is set
and the installed `rustup` version does not supports them.

In order to provide backwards compatibility for `v1` version,
there is no value for `profile` input set by default,
which means that the `default` profile is used by `rustup`
(and that includes `rust-docs`, `clippy` and `rustfmt`).\
You may want to consider using `profile: minimal` to speed up toolchain installation.

## Components

This Action supports rustup [components](https://blog.rust-lang.org/2019/10/15/Rustup-1.20.0.html#installing-the-latest-compatible-nightly) too,
and in combination with the [profiles](#profiles) input it allows to install only the needed components:

```yaml
- name: Install minimal stable with clippy and rustfmt
  uses: actions-rs/toolchain@v1
  with:
    profile: minimal
    toolchain: stable
    components: rustfmt, clippy
```

As an extra perk, `rustup >= 1.20.0` is able to find the most recent `nightly` toolchain
with the requested components available; next example is utilizing this feature
to install the minimal set of `nightly` toolchain components with the `rustfmt` and `clippy` extras:

```yaml
- name: Install minimal nightly with clippy and rustfmt
  uses: actions-rs/toolchain@v1
  with:
    profile: minimal
    toolchain: nightly
    components: rustfmt, clippy
```

Same to the `profile` input, if the installed `rustup` does not supports "components",
it will be automatically upgraded by this Action.

## Notes

As `rustup` is not installed by default for [macOS environments](https://help.github.com/en/articles/virtual-environments-for-github-actions)
at the moment (2019-09-13), this Action will try its best to install it before any other operations.
