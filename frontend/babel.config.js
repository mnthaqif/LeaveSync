module.exports = function (api) {
  // Detect the platform via `caller`; this also configures caching based on the caller automatically.
  const platform = api.caller((caller) => caller && caller.platform);
  const isWeb = platform === 'web';

  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['nativewind/babel'],
  };
};
