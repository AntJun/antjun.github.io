const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
  {
    ignores: [
      '_includes/scripts/components/lightbox.js',
      '_includes/scripts/lib/gallery.js',
      '_includes/search-providers/default/search-data.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['_includes/**/*.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        $: 'readonly',
        AV: 'readonly',
        dataLayer: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none' }],
    },
  },
];
