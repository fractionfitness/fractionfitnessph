module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    'eslint-config-airbnb-base',
    'plugin:node/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // not required if using react v17 & later | not installed
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
  },
  plugins: ['react', 'import'],
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
    'node/no-missing-import': [
      'error',
      {
        // allowModules: [],
        // resolvePaths: ['/path/to/a/modules/directory'],
        tryExtensions: ['.js', '.jsx', '.json', '.node'],
      },
    ],
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     mjs: 'never',
    //     jsx: 'never',
    //   },
    // ],
    // 'import/no-extraneous-dependencies': [
    //   'warn',
    //   {
    //     devDependencies: ['*.config*'], // don't lint matching files
    //   },
    // ],
  },
};
