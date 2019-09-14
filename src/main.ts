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

async function get_rustup(toolchain: string, target?: string): Promise<string> {
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
    if (target) {
        args.push('--default-host');
        args.push(target);
    }

    switch (process.platform) {
        case 'darwin':
        case 'linux':  // Should be installed already, but just in case
            const rustupSh = await downloadRustInit('https://sh.rustup.rs', 'rustup-init.sh');
            await do_exec(rustupSh, args);
            break;

        case 'win32':
            const rustupExe = await downloadRustInit('http://win.rustup.rs', 'rustup-init.exe');
            await do_exec(rustupExe, args);
            break;

        default:
            throw new Error(`Unknown platform ${process.platform}, can't install rustup`);
    }

    core.addPath(path.join(process.env['HOME'], '.cargo', 'bin'));

    return 'rustup';
}

async function do_exec(program: string, args: string[]): Promise<number> {
    try {
        return await exec.exec(program, args);
    } catch (error) {
        core.setFailed(error.message);
        throw error;
    }
}

async function run() {
    let opts;
    try {
        opts = args.toolchain_args();
    } catch (error) {
        core.setFailed(error.message);
        return;
    }

    const rustup = await get_rustup(opts.name, opts.target);

    await do_exec(rustup, ['toolchain', 'install', opts.name]);

    if (opts.default) {
        await do_exec(rustup, ['default', opts.name]);
    }

    if (opts.override) {
        await do_exec(rustup, ['override', 'set', opts.name]);
    }

    if (opts.target) {
        await do_exec(rustup, ['target', 'add', '--toolchain', opts.name, opts.target]);
    }
}

run();
