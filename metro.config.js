const { getDefaultConfig } = require('expo/metro-config');

// Enable CSS only for web platform to avoid native build issues
const isWeb = process.env.EXPO_OS === 'web' || process.env.EAS_BUILD_PLATFORM === 'web' || process.env.WEB === 'true';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true, // Always enable CSS to fix modal.module.css issue
});

// SVG transformer support
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;