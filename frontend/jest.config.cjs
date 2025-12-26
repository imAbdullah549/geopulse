module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    // CSS
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // Static assets (svg, images, etc.)
    "\\.(svg|png|jpg|jpeg|gif|webp|avif)$":
      "<rootDir>/src/test/__mocks__/fileMock.ts",

    // Vite absolute asset import used by template: import viteLogo from '/vite.svg'
    "^/vite\\.svg$": "<rootDir>/src/test/__mocks__/fileMock.ts",
  },

  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },

  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
};
