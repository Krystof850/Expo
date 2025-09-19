const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable problematic Terminal Reporter
config.reporter = { update: () => {} };

// SVG transformer support
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Replit environment configuration for web
// Note: Metro server configuration is handled by Expo CLI directly

module.exports = config;