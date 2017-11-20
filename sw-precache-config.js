module.exports = {
  staticFileGlobs: [
    'dist/**.html',
    'dist/**.js',
    'dist/**.css',
    'dist/assets/images/*',
    'dist/assets/icons/*',
    'dist/assets/*',
    'dist/assets/**',
    'dist/**'
  ],
  root: 'dist',
  stripPrefix: 'dist/',
  navigateFallbackWhitelist: [/^(?!\/__).*/],
  navigateFallback: '/index.html'
};
