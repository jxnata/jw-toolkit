/** @type {import('jest').Config} */
module.exports = {
	// babel-jest handles TypeScript via babel-preset-expo
	transform: {
		'^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
	},
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		// stub out packages that are not needed for util tests
		'^expo-location$': '<rootDir>/src/__mocks__/expo-location.js',
		'^lodash/sum$': '<rootDir>/src/__mocks__/lodash-sum.js',
	},
	testMatch: ['**/*.test.[jt]s?(x)'],
	// Integration tests hit a real database and run only through `bun run test:integration`
	testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.test\\.'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
