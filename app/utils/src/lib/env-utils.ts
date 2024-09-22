export const getEnvVar = (name: string) => {
    const value = process.env[name]
    if (value === undefined) {
        throw new Error(`Variable ${name} is unset`);
    }
    return value;
};