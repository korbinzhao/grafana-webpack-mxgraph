const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractTextPluginBase = new ExtractTextPlugin('./css/flowchart.css');

module.exports = {
  target: 'node',
  context: path.resolve('src'),
  entry: './module.js',
  output: {
    filename: "module.js",
    path: path.resolve('dist'),
    libraryTarget: "amd"
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    'jquery', 'lodash', 'moment',
    function (context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: 'plugin.json' },
      { from: 'partials/*' },
      { from: 'img/*' }
    ]),
    ExtractTextPluginBase,
  ],
  resolve: {
    alias: {
      'src': path.resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(external)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: [
              require.resolve('babel-preset-env')
            ]
          }
        }
      },
      {
        test: /\.base\.(s?)css$/,
        use: ExtractTextPluginBase.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  }
}
