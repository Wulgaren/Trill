module.exports = {
  root: true,
  env: { browser: true, es2023: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest", // Always use the latest ECMAScript features.
  },
  plugins: [
    "react",
    "react-hooks",
    "react-refresh",
    "eslint-plugin-react-compiler",
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-compiler/react-compiler": 2,
    "no-constant-binary-expression": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
