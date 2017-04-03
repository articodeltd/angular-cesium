var webpack = require('webpack');
var helpers = require('./root-helper');

module.exports = {
  devtool: 'inline-source-map',
  
  resolve: {
    extensions: ['','.ts', '.js']
  },
  
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [ 'awesome-typescript-loader', 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
        
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null-loader'
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('demo', 'app'), helpers.root('src')],
        loader: 'null-loader'
      },
      {
        test: /\.css$/,
        include: [helpers.root('demo', 'app'), helpers.root('src')],
        loader: 'raw-loader'
      }
    ],
    exprContextCritical: false
  },
};