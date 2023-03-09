# Install Rust Toolchain via rust-toolchain.toml

Fork of https://github.com/dtolnay/rust-toolchain that supports and makes it mandatory to use a rust-toolchain.toml file.

## Example workflow

Create a [`rust-toolchain.toml`](https://rust-lang.github.io/rustup/overrides.html#the-toolchain-file) file:

```toml
[toolchain]
channel = "1.68"
components = [ "rustfmt", "clippy" ]
```

Then add an entry to this action in your github actions:

```yaml
name: test suite
on: [push, pull_request]

jobs:
  test:
    name: cargo test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dsherret/rust-toolchain-file@1
      - run: cargo test --all-features
```

The selection of Rust toolchain is made based on the rust-toolchain.toml file.

## Inputs

None. You must define everything in the rust-toolchain.toml file.

## Outputs

<table>
<tr>
  <th>Name</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>cachekey</code></td>
  <td>A short hash of the installed rustc version, appropriate for use as a cache key. <code>"20220627a831"</code></td>
</tr>
<tr>
  <td><code>name</code></td>
  <td>Rustup's name for the selected version of the toolchain, like <code>"1.62.0"</code>. Suitable for use with <code>cargo +${{steps.toolchain.outputs.name}}</code>.</td>
</tr>
</table>

## License

The scripts and documentation in this project are released under the [MIT
License].

[MIT License]: LICENSE
