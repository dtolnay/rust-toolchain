declare module "mock-env" {
    function morph<T>(
        callback: () => T,
        vars: object,
        toRemove?: string[]
    )
}
