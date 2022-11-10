/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  printWidth: 100,
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf"
};
