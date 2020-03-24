import * as core from "@actions/core";
import path from "path";

import * as args from "./args";
import * as versions from "./versions";
import { RustUp, ToolchainOptions } from "@actions-rs/core";

async function run(): Promise<void> {
    // we use path.join to make sure this works on Windows, Linux and MacOS
    const toolchainOverridePath = path.join(process.cwd(), "rust-toolchain");

    const opts = args.getToolchainArgs(toolchainOverridePath);
    const rustup = await RustUp.getOrInstall();
    await rustup.call(["show"]);

    let shouldSelfUpdate = false;
    if (opts.profile && !(await rustup.supportProfiles())) {
        shouldSelfUpdate = true;
    }
    if (opts.components && !(await rustup.supportComponents())) {
        shouldSelfUpdate = true;
    }
    if (shouldSelfUpdate) {
        core.startGroup("Updating rustup");
        try {
            await rustup.selfUpdate();
        } finally {
            core.endGroup();
        }
    }

    if (opts.profile) {
        // @ts-ignore: TS2345
        await rustup.setProfile(opts.profile);
    }

    const installOptions: ToolchainOptions = {
        default: opts.default,
        override: opts.override,
    };
    if (opts.components) {
        installOptions.components = opts.components;
    }
    // We already did it just now, there is no reason to do that again,
    // so it would skip few network calls.
    if (shouldSelfUpdate) {
        installOptions.noSelfUpdate = true;
    }

    // Extra funny case.
    // Due to `rustup` issue (https://github.com/rust-lang/rustup/issues/2146)
    // right now installing `nightly` toolchain with extra components might fail
    // if that specific `nightly` version does not have this component
    // available.
    //
    // See https://github.com/actions-rs/toolchain/issues/53 also.
    //
    // By default `rustup` does not downgrade, as it does when you are
    // updating already installed `nightly`, so we need to pass the
    // corresponding flag manually.
    //
    // We are doing it only if both following conditions apply:
    //
    //   1. Requested toolchain is `"nightly"` (exact string match).
    //   2. At least one component is requested.
    //
    // All other cases are not triggering automatic downgrade,
    // for example, installing specific nightly version
    // as in `"nightly-2020-03-20"` or `"stable"`.
    //
    // Motivation is that users probably want the latest one nightly
    // with rustfmt and clippy (miri, etc) and they don't really care
    // about what exact nightly it is.
    // In case if it's not the nightly at all or it is a some specific
    // nightly version, they know what they are doing.
    if (opts.name == "nightly" && opts.components) {
        installOptions.allowDowngrade = true;
    }

    await rustup.installToolchain(opts.name, installOptions);

    if (opts.target) {
        await rustup.addTarget(opts.target, opts.name);
    }

    await versions.gatherInstalledVersions();
}

async function main(): Promise<void> {
    try {
        await run();
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
