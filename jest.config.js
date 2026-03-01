/** @type {import('jest').Config} */
module.exports = {
	// babel-jest handles TypeScript via babel-preset-expo
	transform: {
		'^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
	},
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		// stub out packages that are not needed for util tests
		'^expo-location$': '<rootDir>/src/__mocks__/expo-location.js',
		'^lodash/sum$': '<rootDir>/src/__mocks__/lodash-sum.js',
	},
	testMatch: ['**/*.test.[jt]s?(x)'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
