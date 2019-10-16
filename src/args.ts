import * as core from '@actions/core';
import {input} from '@actions-rs/core';

export interface ToolchainOptions {
    name: string,
    target: string | undefined,
    default: boolean,
    override: boolean,
    profile: string | undefined,
    components: string[] | undefined,
}

export function toolchain_args(): ToolchainOptions {
    let components: string[] | undefined = input.getInputList('components');
    if (components && components.length === 0) {
        components = undefined;
    }
    return {
        name: input.getInput('toolchain', {required: true}),
        target: input.getInput('target') || undefined,
        default: input.getInputBool('default'),
        override: input.getInputBool('override'),
        profile: input.getInput('profile') || undefined,
        components: components,
    };
}
