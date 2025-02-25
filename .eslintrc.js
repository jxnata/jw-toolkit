module.exports = {
	extends: ['expo', 'prettier'],
	plugins: ['prettier'],
	rules: { 'prettier/prettier': 'error' },
	overrides: [{ files: ['**/*styles.ts'], rules: { '@typescript-eslint/no-implicit-any': 'off' } }],
}
