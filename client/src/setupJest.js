// Set up a global fetch mock
global.fetch = require('jest-fetch-mock');

// Mock axios
jest.mock('axios', () => {
  const axiosMock = {
    create: jest.fn(() => axiosMock),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn()
      },
      response: {
        use: jest.fn(),
        eject: jest.fn()
      }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  };
  return axiosMock;
});

// Mock localStorage for TokenStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock; 