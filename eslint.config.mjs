import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  reactRecommended,
  ...compat.extends("next/core-web-vitals"),
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: {
      'react': reactRecommended.plugins.react,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
