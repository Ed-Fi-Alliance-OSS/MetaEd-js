module.exports = function (w) {
  return {
    files: [
      'src/**/*.ts',
      'src/**/*.js'
    ],
    tests: [
      'test/**/*.ts',
      'test/**/*.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'mocha'
  };
};