const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'index.jsx'),
  output: {
    filename: 'index.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js"]
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
  },
  plugins: [
    new MonacoWebpackPlugin()
  ]
};
