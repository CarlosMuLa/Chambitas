module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NOTE: this is required to pass the right environment
      [
        'transform-inline-environment-variables',
        {
          include: ['TAMAGUI_TARGET', 'EXPO_PUBLIC_COGNITO_CLIENT_ID'],
        },
      ],
      // NOTE: this is optional, you don't *need* the compiler
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
      // NOTE: this is only necessary if you use reanimated for animations
      'react-native-worklets/plugin',
    ],
  }
}