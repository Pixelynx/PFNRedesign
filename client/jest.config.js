module.exports = {
  // Use create-react-app's preset
  preset: 'react-scripts',
  
  // Setup files to run before tests
  setupFiles: [
    "<rootDir>/src/setupJest.js"
  ],
  
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js"
  ],
  
  // Module name mappings for non-JS imports
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
  
  // For handling ES modules (critical for axios)
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: './babel.config.js' }]
  },
  
  // Explicitly tell Jest how to handle ES modules
  extensionsToTreatAsEsm: ['.js', '.jsx', '.ts', '.tsx'],
  
  // Transform any ESM modules in node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(axios|@tanstack|zod|react-hook-form)/)"
  ]
};