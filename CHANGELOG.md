# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2020-03-24

### Added

- Pass `allow-downgrade` flag to `rustup` if `nightly` toolchain with components requested

## [1.0.5] - 2020-01-26

### Fixed

- `rustup` version parser does not fail Action execution on `macOS-latest` VM images anymore

## [1.0.4] - 2020-01-26

### Added

- Support for the `rust-toolchain` file: If the toolchain input is not given, we will try and install the version specified in the `rust-toolchain` file.
- Action outputs with `rustc`, `cargo` and `rustup` versions installed

## [1.0.3] - 2019-10-19

### Added

- Support for `rustup set profile` command
- Support for `--component` flag for the `rustup toolchain install` command

## [1.0.2] - 2019-10-14

### Changed

- Missing `rustup` executable will not raise an annotating warning before the installation anymore (#13)

## [1.0.1] - 2019-10-05

### Changed

- `target` input is not used as a `--default-target` argument for `rustup` anymore (#8)

## [1.0.0] - 2019-09-15

### Added

- First public version
