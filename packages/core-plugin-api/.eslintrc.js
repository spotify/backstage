module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    // TODO: add prop types to JS and remove
    'react/prop-types': 0,
    'jest/expect-expect': 0,
  },
};
