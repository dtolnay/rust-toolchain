import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import * as args from './args';
import {RustUp, ToolchainOptions} from '@actions-rs/core';

async function run() {
    const opts = args.toolchain_args();
    const rustup = await RustUp.getOrInstall();
    await rustup.call(['show']);

    let shouldSelfUpdate = false;
    if (opts.profile && !await rustup.supportProfiles()) {
        shouldSelfUpdate = true;
    }
    if (opts.components && !await rustup.supportComponents()) {
        shouldSelfUpdate = true;
    }
    if (shouldSelfUpdate) {
        core.startGroup('Updating rustup');
        try {
            await rustup.selfUpdate();
        } finally {
            core.endGroup();
        }
    }

    if (opts.profile) {
        //@ts-ignore
        await rustup.setProfile(opts.profile);
    }

    let installOptions: ToolchainOptions = {
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
    await rustup.installToolchain(opts.name, installOptions);

    if (opts.target) {
        await rustup.addTarget(opts.target, opts.name);
    }
}

async function main() {
    try {
        await run();
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
