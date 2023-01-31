module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: ['eslint-config-airbnb-base', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // eslint doesn't function as expected using ignorePatterns so just use .eslintignore
  // ignorePatterns: ['**/node_modules/**', '**/build/**'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'node/no-unsupported-features/es-syntax': [
      'warn',
      {
        version: 'latest',
        ignores: ['modules'],
      },
    ],
    'node/no-unpublished-require': 'off', // not publishing this app so rule not needed
    'import/no-extraneous-dependencies': 'warn',
    // 'import/no-extraneous-dependencies': [
    //   'warn',
    //   {
    //     devDependencies: ['*.config*'], // don't lint matching files
    //   },
    // ],
  },
};
