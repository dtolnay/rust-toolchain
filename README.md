# Install Rust Toolchain

This GitHub Action installs a Rust toolchain using rustup. It is designed for
one-line concise usage and good defaults.

<br>

## Example workflow

```yaml
name: test suite
on: [push, pull_request]

jobs:
  test:
    name: cargo test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo test --all-features
```

The selection of Rust toolchain is made based on the particular @rev of this
Action being requested. For example "dtolnay/rust-toolchain@nightly" pulls in
the nightly Rust toolchain, while "dtolnay/rust-toolchain@1.89.0" pulls in
1.89.0.

<br>

## Inputs

All inputs are optional.

<table>
<tr>
  <th>Name</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>toolchain</code></td>
  <td>
    Rustup toolchain specifier e.g. <code>stable</code>, <code>nightly</code>, <code>1.89.0</code>, <code>nightly-2025-01-01</code>.
    <b>Important: the default is to match the @rev as described above.</b>
    When passing an explicit <code>toolchain</code> as an input instead of @rev, you'll want to use "dtolnay/rust-toolchain@master" as the revision of the action.
  </td>
</tr>
<tr>
  <td><code>targets</code></td>
  <td>Comma-separated string of additional targets to install e.g. <code>wasm32-unknown-unknown</code></td>
</tr>
<tr>
  <td><code>components</code></td>
  <td>Comma-separated string of additional components to install e.g. <code>clippy, rustfmt</code></td>
</tr>
</table>

<br>

## Outputs

<table>
<tr>
  <th>Name</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>cachekey</code></td>
  <td>A short hash of the installed rustc version, appropriate for use as a cache key. <code>"20250627a831"</code></td>
</tr>
<tr>
  <td><code>name</code></td>
  <td>Rustup's name for the selected version of the toolchain, like <code>"1.62.0"</code>. Suitable for use with <code>cargo +${{steps.toolchain.outputs.name}}</code>.</td>
</tr>
</table>

<br>

## Toolchain expressions

The following forms are available for projects that use a sliding window of
compiler support.

```yaml
     # Installs the most recent stable toolchain as of the specified time
     # offset, which may be written in years, months, weeks, or days.
  - uses: dtolnay/rust-toolchain@master
    with:
      toolchain: stable 18 months ago
```

```yaml
     # Installs the stable toolchain which preceded the most recent one by
     # the specified number of minor versions.
  - uses: dtolnay/rust-toolchain@master
    with:
      toolchain: stable minus 8 releases
```

<br>

## License

The scripts and documentation in this project are released under the [MIT
License].

[MIT License]: LICENSE
