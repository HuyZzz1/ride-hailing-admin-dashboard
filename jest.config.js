module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'next-auth/jwt': '<rootDir>/__mocks__/next-auth-jwt.js', // Mock next-auth
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@upstash|next-auth|jose)/)', // Thêm các module cần transform
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
