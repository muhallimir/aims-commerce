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
          '@components': './src/components'
        }
      }
    ]
  ]
};
