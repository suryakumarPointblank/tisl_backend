require('reflect-metadata');
require('ts-node').register({
  project: './tsconfig.json',
  transpileOnly: false,
});
require('./src/main');
