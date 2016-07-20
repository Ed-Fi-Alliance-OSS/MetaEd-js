module.exports = function (w) {

  return {
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'test/**/*Test.ts'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'mocha'
  };
};