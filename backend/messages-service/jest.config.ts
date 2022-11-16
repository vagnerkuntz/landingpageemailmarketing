const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: ['node_modules', 'server.ts', 'messageModel.ts'],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  preset: "ts-jest",
  setupFiles: ["dotenv/config", "tsconfig-paths/register"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts"]
}
