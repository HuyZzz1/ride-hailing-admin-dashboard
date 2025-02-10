module.exports = {
  getToken: jest.fn(() => Promise.resolve({ user: { name: 'Test User' } })),
};
