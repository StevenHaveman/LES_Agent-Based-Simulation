module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },

  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};