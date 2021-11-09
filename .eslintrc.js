const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:cypress/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'cypress',
  ],
  rules: {
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
};
