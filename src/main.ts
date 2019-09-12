import * as core from '@actions/core';
import * as exec from '@actions/exec';

import * as args from './args';

async function do_exec(program: string, args: string[]) {
    try {
        await exec.exec(program, args);
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function run() {
    let opts = args.toolchain_args();
    await do_exec('rustup', ['toolchain', 'install', opts.name]);

    if (opts.default) {
        await do_exec('rustup', ['default', opts.name]);
    }

    if (opts.override) {
        await do_exec('rustup', ['override', opts.name]);
    }
}

run();
