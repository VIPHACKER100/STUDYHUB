export default {
    transform: {},
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts', '.tsx'], // If needed
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
