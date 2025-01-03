import globals from 'globals';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
  eslintConfigPrettier,
];
