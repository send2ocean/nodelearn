module.exports = {
  "env": {
    "es6": true,
    "node": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  "extends": "airbnb-base",
  "rules": {
    "indent": [2, 2, {"SwitchCase": 1}],
    "no-underscore-dangle": [2, {"allowAfterThis": true}],
    "global-require": 0,
    "no-param-reassign": [2, {"props": false}],
    "object-curly-spacing": 0,
    "no-unused-expressions": [2, {"allowShortCircuit": true}]
  },
};
