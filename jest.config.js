const config = {
  verbose: true,
  //modulePaths: ['<rootDir>/test/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  testMatch: ["<rootDir>/test/unit/**/*.(ts|tsx)"]
}

module.exports = config
