# Install Rust Toolchain

This GitHub Action installs a Rust toolchain using rustup. It is designed for
one-line concise usage.

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
      - run: cargo test --all-features
```

The selection of Rust toolchain is made based on the particular @rev of this
Action being requested. For example "dtolnay/rust-toolchain@nightly" pulls in
the nightly Rust toolchain, while "dtolnay/rust-toolchain@1.42.0" pulls in
1.42.0.

## Inputs

All inputs are optional.

| Name         | Description                                                                                                                        |
| ------------ | -----------------------------------------------------------------------------------------------------------------------------------|
| `toolchain`  | Rustup toolchain specifier e.g. `stable`, `nightly`, `1.42.0`. **Important: the default is to match the @rev as described above.** |
| `target`     | Additional target support to install e.g. `wasm32-unknown-unknown`                                                                 |
| `components` | Comma-separated string of additional components to install e.g. `clippy, rustfmt`                                                  |

## License

The scripts and documentation in this project are released under the [MIT
License].

[MIT License]: LICENSE
