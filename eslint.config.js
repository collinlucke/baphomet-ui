import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'dist/**/*',
      'build/**/*',
      'node_modules/**/*',
      'phantomartist/**/*',
      '*.config.js',
      '*.config.mjs',
      'dev-phantomartist.js',
      'link-package.js',
      'set-dependency.js',
      'setup-phantomartist.js'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node // Add Node.js globals like 'process'
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/no-unknown-property': ['error', { ignore: ['css'] }], // Allow emotion css prop
      'react/no-unescaped-entities': 'off', // Allow unescaped quotes in JSX
      '@typescript-eslint/no-unused-vars': 'warn', // Downgrade to warning
      '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
      '@typescript-eslint/prefer-as-const': 'warn', // Downgrade to warning
      '@typescript-eslint/no-unsafe-function-type': 'warn', // Downgrade to warning
      'no-unsafe-optional-chaining': 'warn', // Downgrade to warning
      'prefer-const': 'warn' // Downgrade to warning
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
