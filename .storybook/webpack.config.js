module.exports = ({ config }) => {
  // Add TypeScript support
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
        },
      },
    ],
  });
  
  // Add .ts and .tsx extensions to webpack resolve
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
}; 