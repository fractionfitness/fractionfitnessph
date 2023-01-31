module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-syzygy-bem',
    'stylelint-config-prettier-scss',
  ],
  plugins: ['stylelint-selector-bem-pattern'],
  // easier to use .stylelintignore to ignore folders and use ignoreFiles to target specific file types
  ignoreFiles: [
    //   '**/node_modules/**/*.+(css|scss|sass)', // ignores all css files in node_modules | there are no css files in node_modules
    //   '**/build/**/*.+(css|scss|sass)', // ignores all css files in build
    '**/*.!(css|scss|sass)', // ignores all file extensions that are not css-related
    '**/!(*.*)', // ignores all files that have no extensions (e.g. LICENSE)
  ],
  rules: {
    'plugin/selector-bem-pattern': {
      componentName: '[A-Z]+',
      componentSelectors: {
        initial: '^\\.{componentName}(?:-[a-z]+)?$',
        combined: '^\\.combined-{componentName}-[a-z]+$',
      },
      utilitySelectors: '^\\.util-[a-z]+$',
    },
  },
};
