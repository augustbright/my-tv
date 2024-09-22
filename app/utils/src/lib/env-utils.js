"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = void 0;
const getEnvVar = (name) => {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Variable ${name} is unset`);
    }
    return value;
};
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=env-utils.js.map