const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,cjs,ts,tsx}': [buildEslintCommand, 'npm run format'],
  '*.{css,scss,sass,md}': [`npm run format`],
};
