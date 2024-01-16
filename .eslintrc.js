module.exports = {
  env: {
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    '@rocketseat/eslint-config/react',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
