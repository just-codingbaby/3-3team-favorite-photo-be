import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
    linterOptions: {
      noInlineConfig: true,
    },
    ignores: ['**/jsconfig.js', 'prisma/*', 'node_modules/*', '**/swagger-output.json'],
  },
  eslintConfigPrettier,
];