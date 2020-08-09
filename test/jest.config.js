const path = require('path')
module.exports = {
  preset: 'ts-jest',
  rootDir: path.resolve(__dirname,'../'),
  globals: {
    __USE_BUILD__: process.argv.indexOf('-use-build') >= 0
  },
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\js$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  moduleNameMapper: {
    '^packages(.*)$': '<rootDir>/packages$1',
    '^src(.*)$': '<rootDir>/src$1'
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testMatch: [
    "<rootDir>/test/specs/*.spec.js"
  ]
}
