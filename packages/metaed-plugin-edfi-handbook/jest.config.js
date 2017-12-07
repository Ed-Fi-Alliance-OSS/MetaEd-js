module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '<rootDir>.*(node_modules)(?!.*metaed-.*).*$',
  ],
  modulePathIgnorePatterns: [
    'dist*',
  ],
};
