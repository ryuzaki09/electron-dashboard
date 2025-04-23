const config = {
  verbose: true,
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@picovoice/porcupine-web': '<rootDir>/test/__mocks__/porcupine-web.js',
    '@picovoice/porcupine-react': '<rootDir>/test/__mocks__/porcupine-react.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  testMatch: ['<rootDir>/test/unit/**/*.(ts|tsx)'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|@picovoice/porcupine-web|@ryusenpai/shared-components)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'] // tell Jest to treat these as ESM
}

module.exports = config
