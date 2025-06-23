const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for Node.js core modules required by Web3 libraries
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "path": require.resolve("path-browserify"),
    // Disable modules that aren't needed for Web3
    "fs": false,
    "net": false,
    "tls": false,
    "zlib": false
  });
  
  config.resolve.fallback = fallback;
  
  // Add plugins to provide global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  
  // Ignore specific warnings that don't affect functionality
  config.ignoreWarnings = [
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes("node_modules") &&
        warning.details &&
        warning.details.includes("source-map-loader")
      );
    },
  ];

  // Fix for Web3Modal and Wagmi compatibility
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
};
