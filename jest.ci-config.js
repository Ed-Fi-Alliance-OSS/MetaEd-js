// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node', 'mjs', 'cjs', 'mts', 'cts'],
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*metaed-.*).*$'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)', '**/__tests__/**/*.m[jt]s', '**/?(*.)+(spec|test).m[jt]s', '**/__tests__/**/*.c[jt]s', '**/?(*.)+(spec|test).c[jt]s'],
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
  workerIdleMemoryLimit: '3900MB',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        ancestorSeparator: ' > ',
        uniqueOutputName: false,
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
};
