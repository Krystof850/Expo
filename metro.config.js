const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Metro Package Exports issue with Node.js 20.19.4+
config.resolver.unstable_enablePackageExports = true;

// SVG transformer support
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Replit environment configuration for web
// Note: Metro server configuration is handled by Expo CLI directly

module.exports = config;