module.exports = {
	printWidth: 140,
	tabWidth: 4,
	singleQuote: true,
	bracketSameLine: true,
	trailingComma: 'es5',
	semi: false,
	useTabs: true,

	plugins: [require.resolve('prettier-plugin-tailwindcss')],
	tailwindAttributes: ['className'],
}
