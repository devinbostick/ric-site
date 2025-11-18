/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
  root: true,
  extends: ["next", "turbo", "prettier"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-require-imports": "error",
  },
  overrides: [
    {
      files: ["scripts/**/*.js", "scripts/*.js"],
      parser: "espree",
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};