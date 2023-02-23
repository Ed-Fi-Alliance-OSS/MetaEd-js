module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*metaed-.*).*$'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: ['packages/**/src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  modulePathIgnorePatterns: ['dist*', 'docs*'],
  setupFiles: ['<rootDir>/jest-setup.js'],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true
  },
  workerIdleMemoryLimit: '300MB',
};
