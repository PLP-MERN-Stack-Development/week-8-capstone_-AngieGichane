module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  // Add these critical settings:
  testMatch: [
    '**/__tests__/**/*.test.jsx',
    '**/?(*.)+(spec|test).jsx'
  ],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};