import { input } from "@actions-rs/core";
import { debug } from "@actions/core";
import { existsSync, readFileSync } from "fs";

export interface ToolchainOptions {
    name: string;
    target: string | undefined;
    default: boolean;
    override: boolean;
    profile: string | undefined;
    components: string[] | undefined;
}

function determineToolchain(overrideFile: string): string {
    const toolchainInput = input.getInput("toolchain", { required: false });

    if (toolchainInput) {
        debug(`using toolchain from input: ${toolchainInput}`);
        return toolchainInput;
    }

    if (!existsSync(overrideFile)) {
        throw new Error(
            "toolchain input was not given and repository does not have a rust-toolchain file"
        );
    }

    const rustToolchainFile = readFileSync(overrideFile, {
        encoding: "utf-8",
        flag: "r",
    }).trim();

    debug(`using toolchain from rust-toolchain file: ${rustToolchainFile}`);

    return rustToolchainFile;
}

export function getToolchainArgs(overrideFile: string): ToolchainOptions {
    let components: string[] | undefined = input.getInputList("components");
    if (components && components.length === 0) {
        components = undefined;
    }

    return {
        name: determineToolchain(overrideFile),
        target: input.getInput("target") || undefined,
        default: input.getInputBool("default"),
        override: input.getInputBool("override"),
        profile: input.getInput("profile") || undefined,
        components: components,
    };
}
