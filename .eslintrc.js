module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceType: 'module'
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    'no-unused-vars': 'warn'
  }
}
