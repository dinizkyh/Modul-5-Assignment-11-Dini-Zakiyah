const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom", // Default for React components
  moduleNameMapper: {
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
  // Don't fail fast in CI to get full test results
  bail: 0,
  // Verbose output in CI for debugging
  verbose: !!process.env.CI,
  // Collect coverage from all source files
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/layout.tsx", // Exclude layout from strict coverage due to HTML structure
    "!src/app/page.tsx", // Exclude main page if it has similar HTML structure
  ],
};

module.exports = createJestConfig(customJestConfig);
