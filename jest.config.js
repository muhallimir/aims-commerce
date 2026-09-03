module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEach: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.{ts,tsx}",
    "<rootDir>/tests/component/**/*.test.{ts,tsx}"
  ],
  moduleNameMapper: {
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@common/(.*)$": "<rootDir>/src/common/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1"
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["babel-jest", { presets: ["next/babel"] }]
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/tests/e2e/"]
};
