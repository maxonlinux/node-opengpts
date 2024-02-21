module.exports = {
  env: {
    browser: false, // Set to false since we're configuring for Node.js
    es2021: true,
    node: true, // Add this to specify the environment as Node.js
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "tslint-config-prettier", // This is a TSLint configuration, not ESLint
    // "tslint-config-airbnb", // This is a TSLint configuration, not ESLint
    "prettier", // Use this for ESLint + Prettier integration
    "airbnb-base", // Use this for ESLint Airbnb style guide for JavaScript (without React)
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script", // Use "script" for CommonJS
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module", // Use "module" for ES6+ modules
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["error", 2], // Use 2 spaces for indentation or "tab" for tabs
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"], // Use single quotes for JavaScript
    semi: ["error", "always"],
  },
};
