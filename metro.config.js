const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'web'];

// Configure for Replit environment - allow all hosts
config.server = {
  ...config.server,
  host: '0.0.0.0',
  port: 5000,
};

module.exports = config;