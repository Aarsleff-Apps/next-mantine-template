import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['**/*.js', '**/*.cjs', '**/*.mjs', '.next/**', 'public/**', '.source/**'],
  },
  ...nextVitals,
  prettier,
  {
    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],

      // The base rule flags TypeScript type signatures; the TS-aware rule doesn't.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
