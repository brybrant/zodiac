import globals from 'globals';
import react from 'eslint-plugin-react';
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks';

import { eslintConfig } from '@brybrant/configs';

export default eslintConfig({
  files: ['**/*.jsx'],
  languageOptions: {
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    react,
    'react-hooks': eslintReactHooksPlugin,
  },
  settings: {
    react: {
      pragma: 'h',
      version: 'detect',
    },
  },
  rules: {
    'react/display-name': [
      1,
      {
        ignoreTranspilerName: false,
      },
    ],
    'react/jsx-key': [
      2,
      {
        checkFragmentShorthand: true,
      },
    ],
    'react/jsx-no-comment-textnodes': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-target-blank': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/no-deprecated': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-find-dom-node': 2,
    'react/no-is-mounted': 2,
    'react/no-string-refs': 2,
    'react/require-render-return': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
  },
});
