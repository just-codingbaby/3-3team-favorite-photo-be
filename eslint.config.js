import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    extends: ['plugin:js/recommended', 'prettier'],
  },
  pluginJs.configs.recommended,
];
