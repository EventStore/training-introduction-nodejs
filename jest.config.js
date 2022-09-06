module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
};
