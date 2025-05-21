module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: 'auto', // Changed from commonjs to auto for better ES module handling
    }],
    ['@babel/preset-react', {
      runtime: 'automatic', // Uses the new JSX transform from React 17+
    }],
    ['@babel/preset-typescript', {
      isTSX: true,
      allExtensions: true,
    }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Helps with async/await and other features
    '@babel/plugin-proposal-class-properties', // Support for class properties
    '@babel/plugin-proposal-object-rest-spread', // Support for spread operators
    '@babel/plugin-proposal-optional-chaining', // Support for ?. operator
    '@babel/plugin-proposal-nullish-coalescing-operator', // Support for ?? operator
  ],
  // Critical for handling ES modules like axios
  sourceType: 'unambiguous'
};