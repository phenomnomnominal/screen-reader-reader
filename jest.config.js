module.exports = {
  globals: {
    tsConfig: 'tsconfig.json'
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**'],
  coverageDirectory: '<rootDir>/reports/coverage',
  transform: {
    '\\.(ts)$': 'ts-jest'
  },
  testRegex: '/test/.*\\.spec\\.ts$',
  preset: 'jest-puppeteer'
};
