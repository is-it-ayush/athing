/** @type {import("prettier").Config} */
module.exports = {
	plugins: [require.resolve('prettier-plugin-tailwindcss')],
	printWidth: 120,
	singleQuote: true,
	bracketSameLine: true,
	trailingComma: 'all',
	tabWidth: 2,
	semi: true,
	useTabs: true,
	overrides: [
		{
			files: '*.html',
			options: {
				parser: 'html',
			},
		},
	],
};
