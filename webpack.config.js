const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'index.tsx'),
  output: {
    filename: 'index.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: __dirname,
    watchContentBase: true,
    port: 8081,
    watchOptions: {
      poll: true,
      ignored: [
        path.resolve(__dirname, 'node_modules')
      ]
    },
  }
};
