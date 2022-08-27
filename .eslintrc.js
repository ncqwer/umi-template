module.exports = {
  // Umi 项目
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-promise-executor-return': 'off',
  },
  overrides: [
    {
      files: '**/test/**/*.js',
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
      },
    },
    {
      files: 'scripts/**/*.js',
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
