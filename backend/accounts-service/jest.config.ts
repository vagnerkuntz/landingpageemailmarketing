const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['node_modules', 'server.ts', 'accountModel.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: [
    'text-summary',
    'lcov',
  ],
  setupFiles: [
    'dotenv/config',
    'tsconfig-paths/register'
  ],
  testMatch: [
    '**/__tests__/**/*.ts',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/'})
}
