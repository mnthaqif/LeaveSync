module.exports = function (api) {
  const platform = api.caller((caller) => caller && caller.platform);
  const isWeb = platform === 'web';

  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['nativewind/babel'],
  };
};
