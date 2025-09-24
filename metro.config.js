const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true, // Always enable CSS to fix modal.module.css issue
});

// SVG transformer support
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;