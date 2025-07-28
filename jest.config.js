const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom", // Default for React components
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  // Improve CI performance
  maxWorkers: process.env.CI ? 2 : "50%",
  // Fail fast in CI
  bail: process.env.CI ? 1 : 0,
  // Verbose output in CI for debugging
  verbose: !!process.env.CI,
  // Collect coverage from all source files
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/layout.tsx", // Exclude layout from strict coverage
  ],
};

module.exports = createJestConfig(customJestConfig);
