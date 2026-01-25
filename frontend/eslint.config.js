export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: true,
        document: true,
        console: true,
        navigator: true,
        setInterval: true,
        clearInterval: true,
      },
    },
    rules: {},
  },
];
