/**
 * Babel config is only used by Jest (babel-jest). Next.js with Turbopack
 * doesn't honor babel.config.js — that was the source of the dev-server
 * crash. Tests still get the @components alias.
 */
module.exports = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@pages': './src/pages',
          '@lib': './src/lib',
          '@store': './src/store',
          '@common': './src/common',
          '@helpers': './src/helpers',
          '@styles': './src/styles',
          '@components': './src/components',
          '@services': './src/services',
        },
      },
    ],
  ],
};
