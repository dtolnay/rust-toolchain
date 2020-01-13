import {input} from '@actions-rs/core';
import {info, debug} from "@actions/core";
import {existsSync, readFileSync} from 'fs';

export interface ToolchainOptions {
    name: string,
    target: string | undefined,
    default: boolean,
    override: boolean,
    profile: string | undefined,
    components: string[] | undefined,
}

export function toolchain_args(overrideFile: string): ToolchainOptions {
    let components: string[] | undefined = input.getInputList('components');
    if (components && components.length === 0) {
        components = undefined;
    }

    return {
        name: determineToolchain(overrideFile),
        target: input.getInput('target') || undefined,
        default: input.getInputBool('default'),
        override: input.getInputBool('override'),
        profile: input.getInput('profile') || undefined,
        components: components,
    };
}

function determineToolchain(overrideFile: string): string {
    if (existsSync(overrideFile)) {
        debug(`using toolchain override from ${overrideFile}`);
        const content = readFileSync(overrideFile, {
            encoding: "utf-8",
            flag: "r"
        });
        return content.trim();
    } else {
        debug(`toolchain override file ${overrideFile} does not exist, falling back to input variable`);
        return input.getInput('toolchain', {required: true})
    }
}
