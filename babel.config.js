module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
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
    ['@babel/plugin-proposal-private-property-in-object', {loose: true}],
    'react-native-reanimated/plugin',
  ],
};
