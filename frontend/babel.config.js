module.exports = function(api) {
  api.cache(true);
  
  // Get caller information to detect the platform
  const caller = api.caller((caller) => caller && caller.platform);
  const isWeb = caller === 'web';
  
  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['nativewind/babel'],
  };
};
