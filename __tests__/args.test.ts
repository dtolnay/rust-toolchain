import * as args from '../src/args'

const testEnvVars = {
    INPUT_TOOLCHAIN: 'nightly-2019-04-20',
    INPUT_DEFAULT: 'false',
    INPUT_OVERRIDE: 'true'
}

describe('actions-rs/toolchain', () => {
    beforeEach(() => {
    for (const key in testEnvVars)
        process.env[key] = testEnvVars[key as keyof typeof testEnvVars]
    })

    it('Parses action input into toolchain options', async () => {
        const result = args.toolchain_args();

        expect(result.name).toBe('nightly-2019-04-20');
        expect(result.default).toBe(false);
        expect(result.override).toBe(true);
    });
});
