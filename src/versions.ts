import * as exec from '@actions/exec';
import * as core from '@actions/core';

export async function gatherInstalledVersions(): Promise<void> {
    try {
        core.startGroup('Gathering installed versions');

        await rustc();
        await cargo();
        await rustup();
    } finally {
        core.endGroup();
    }
}

/**
 * Fetch currently used `rustc` version
 */
async function rustc(): Promise<void> {
    const stdout = await getStdout('rustc', ['-V']);
    try {
        const version = parseFull(stdout);

        core.setOutput('rustc', version.long);
        core.setOutput('rustc_hash', version.hash);
    } catch(e) {
        core.warning(e);
        core.setOutput('rustc', parseShort(stdout));
    }
}

/**
 * Fetch currently used `cargo` version
 */
async function cargo(): Promise<void> {
    const stdout = await getStdout('cargo', ['-V']);
    try {
        const version = parseFull(stdout);

        core.setOutput('cargo', version.long);
    } catch(e) {
        core.setOutput('cargo', parseShort(stdout));
    }
}

async function rustup(): Promise<void> {
    const stdout = await getStdout('rustup', ['-V']);
    try {
        const version = parseFull(stdout);
        core.setOutput('rustup', version.long);
    } catch(e) {
        core.setOutput('rustup', parseShort(stdout));
    }
}

interface Version {
    long: string,
    hash: string,
}

/**
 * Try to parse the version parts and return them.
 *
 * It is important to note that some components are not providing
 * all the expected information, ex. `rustup` on `macOS-latest` VM image
 * does not has the hash in the version string,
 * so this function might throw an error.
 *
 * As a fallback, `parseShort` function can be used.
 */
function parseFull(stdout: string): Version {
    stdout = stdout.trim();
    const matches = stdout.match(/\S+\s((\S+)\s\((\S+)\s(\S+)\))/m);
    if (matches == null) {
        throw new Error(`Unable to parse version from the "${stdout}" string`);
    }

    return {
        long: matches[1],
        hash: matches[3],
    }
}

function parseShort(stdout: string): string {
    stdout = stdout.trim();
    const matches = stdout.match(/\S+\s(.+)/m);
    if (matches == null) {
        core.warning(`Unable to determine version from the "${stdout}" string`);
        return '';
    } else {
        return matches[1];
    }
}

async function getStdout(exe: string, args: string[], options?: {}): Promise<string> {
    let stdout = '';
    const resOptions = Object.assign({}, options, {
        listeners: {
            stdout: (buffer: Buffer) => {
                stdout += buffer.toString();
            },
        },
    });

    await exec.exec(exe, args, resOptions);

    return stdout;
}
