export default {
	verbose: true,
	testMatch: ['<rootDir>/**/?(*.)+(test).ts?(x)'],
	coveragePathIgnorePatterns: [
		'dist',
	],
	moduleFileExtensions: ['ts', 'js'],
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.[jt]s$': ['ts-jest', {
			useESM: true
		}],
	},
};
