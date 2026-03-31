import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import nodePlugin from 'eslint-plugin-n'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**']),
  js.configs.recommended,
  {
    files: ['apps/web/**/*.{js,jsx}'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: [
      'apps/workstations-api/**/*.js',
      'scripts/**/*.js',
      '*.config.js',
      'apps/web/vite.config.js'
    ],
    extends: [
      nodePlugin.configs['flat/recommended-script'],
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
      sourceType: 'module',
    },
  },
  eslintConfigPrettier,
])