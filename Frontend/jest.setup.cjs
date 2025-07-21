require('@testing-library/jest-dom');
const { server } = require('./mocks/server');

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers
afterEach(() => server.resetHandlers());

// Disable API mocking after tests
afterAll(() => server.close());