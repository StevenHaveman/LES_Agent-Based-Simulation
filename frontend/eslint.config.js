import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

const DEFAULT_TAB_SIZE = 4;

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: { js, '@stylistic': stylistic },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser },
        rules: {
            'no-unused-vars': 'error',
            'no-magic-numbers': ['warn', { 'ignore': [0, 1, -1] }],
            'eqeqeq': 'error',
            'no-console': ['warn', { 'allow': ['warn', 'error'] }],
            'no-duplicate-case': 'error',
            'no-duplicate-imports': 'error',
            'prefer-const': 'error',
            'curly': 'error',
            'no-var': 'error',
            'no-else-return': 'error',
            'no-unreachable': 'error',
            'no-self-compare': 'error',
            'no-compare-neg-zero': 'error',

            '@stylistic/indent': ['error', DEFAULT_TAB_SIZE],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
        },
    },
    pluginReact.configs.flat.recommended,
]);
