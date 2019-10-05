const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');

const download = require('download');

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import * as args from './args';

function downloadRustInit(url: string, name: string): Promise<string> {
    const absPath = path.join(os.tmpdir(), name);

    return new Promise((resolve, reject) => {
        let req = download(url);
        let output = fs.createWriteStream(absPath, {
            mode: 0o755
        });

        req.pipe(output);
        req.on('end', () => {
            output.close(resolve);
        });
        req.on('error', reject);
        output.on('error', reject);
    })
    .then(() => {
        return absPath;
    });
}

async function get_rustup(toolchain: string): Promise<string> {
    try {
        const foundPath = await io.which('rustup', true);
        core.debug(`Found rustup at ${foundPath}`);
        return foundPath;
    } catch (error) {
        core.warning('Unable to find rustup, installing it now');
    }

    let args = [
        '-y',
        '--default-toolchain',
        toolchain,
    ];

    // Note: `target` input can't be used here for `--default-host` argument, see #8

    switch (process.platform) {
        case 'darwin':
        case 'linux':  // Should be installed already, but just in case
            const rustupSh = await downloadRustInit('https://sh.rustup.rs', 'rustup-init.sh');
            await exec.exec(rustupSh, args);
            break;

        case 'win32':
            const rustupExe = await downloadRustInit('http://win.rustup.rs', 'rustup-init.exe');
            await exec.exec(rustupExe, args);
            break;

        default:
            throw new Error(`Unknown platform ${process.platform}, can't install rustup`);
    }

    core.addPath(path.join(process.env['HOME'], '.cargo', 'bin'));

    return 'rustup';
}

async function run() {
    const opts = args.toolchain_args();
    const rustup = await get_rustup(opts.name);

    await exec.exec(rustup, ['toolchain', 'install', opts.name]);

    if (opts.default) {
        await exec.exec(rustup, ['default', opts.name]);
    }

    if (opts.override) {
        await exec.exec(rustup, ['override', 'set', opts.name]);
    }

    if (opts.target) {
        await exec.exec(rustup, ['target', 'add', '--toolchain', opts.name, opts.target]);
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
