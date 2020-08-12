var path = require('path');

module.exports = {
  mode: 'production',
  // entry: './lambda.js',
  entry: './run-local-server.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sendToInboxLambda.js',
    libraryTarget: 'umd'
  }
};
