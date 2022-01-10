const nopConfig = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  plugins: [
    'import',
    'simple-import-sort',
    'unicorn',
  ],
};

const realConfig = {
  ...nopConfig,
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/errors',
    'plugin:unicorn/recommended',
  ],
  rules: {
    'unicorn/filename-case': 0,
    'unicorn/no-null': 0,
    'unicorn/no-reduce': 0,
    'unicorn/prevent-abbreviations': 0,
    'linebreak-style': 0,



    // END.

    // Import sort
    'simple-import-sort/imports': 2,
    'simple-import-sort/exports': 2,
    'sort-imports': 0,
    'import/order': 0,
    // END.
    // TODO: Useful rules, but disabled temporary
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/alt-text': 0,
    'jsdoc/require-param-type': 0,
    'jsdoc/require-returns': 0,
    'jsdoc/require-param-description': 0,
  },
};

module.exports = process.env.DISABLE_ESLINT ? nopConfig : realConfig;
