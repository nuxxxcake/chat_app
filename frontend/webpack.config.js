const path = require("path");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    filename: "main.js"
  },
  devServer: {  
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    compress: true,
    port: 3000,
    watchContentBase: true,
    progress: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'containers': path.resolve(__dirname, './src/containers'),
      'components': path.resolve(__dirname, './src/components'),
      'reduxMain': path.resolve(__dirname, './src/redux'),
      'actions': path.resolve(__dirname, './src/redux/actions'),
      'helpers': path.resolve(__dirname, './src/helpers'),
      'services': path.resolve(__dirname, './src/services'),
      'images': path.resolve(__dirname, './src/images'),
      'assets': path.resolve(__dirname, './src/assets')
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?importLoaders=1&limit=100000'
      },
      {
        test: /\.(sass|css)$/i,
        use: [
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv()
  ]
};