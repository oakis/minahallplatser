module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.js', '.json'],
        alias: {
          '@src': './src',
          '@components': './src/components',
          '@common': './src/components/common',
          '@actions': './src/actions',
          '@types': './src/actions/types',
          '@assets': './src/assets',
          '@helpers': './src/components/helpers',
          '@modals': './src/components/modals',
          '@style': './src/components/style',
          '@reducers': './src/reducers',
        },
      },
    ],
  ],
};
