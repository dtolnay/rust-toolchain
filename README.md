# Install Rust Toolchain

This GitHub Action installs a Rust toolchain using rustup. It is a fork of
*[actions-rs/toolchain]* designed for more concise usage.

[actions-rs/toolchain]: https://github.com/actions-rs/toolchain

## Example workflow

```yaml
name: test suite
on: [push, pull_request]

jobs:
  test:
    name: cargo test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo test
```

The selection of Rust toolchain is made based on the particular @rev of this
Action being requested. For example "dtolnay/rust-toolchain@nightly" pulls in
the nightly Rust toolchain, while "dtolnay/rust-toolchain@1.42.0" pulls in
1.42.0.

## Inputs

All inputs are optional.

| Name         | Description                                                                                                                        |
| ------------ | -----------------------------------------------------------------------------------------------------------------------------------|
| `toolchain`  | Rustup toolchain specifier, ex. `stable`, `nightly`, `1.42.0`. **Important: the default is to match the @rev as described above.** |
| `target`     | Additional target support to install, ex. `wasm32-unknown-unknown`                                                                 |
| `components` | Comma-separated string of additional components to install, ex. `clippy, rustfmt`                                                  |

## License

The scripts and documentation in this project are released under the [MIT
License](LICENSE)
