const base = require('./jest.config')

/** @type {import('jest').Config} */
module.exports = {
	...base,
	// Talks to a real InstantDB app — see src/services/instantdb/backup-service.integration.test.ts
	testMatch: ['**/*.integration.test.[jt]s?(x)'],
	testPathIgnorePatterns: ['/node_modules/'],
	testTimeout: 120000,
}
