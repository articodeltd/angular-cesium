var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var root = require('./root-helper');

var ENV = process.env.npm_lifecycle_event;
var SERVER = ENV === 'build-demo' ? '' : 'http://localhost:3000';

module.exports = {
  entry: {
    'polyfills': './demo/polyfills.ts',
    'vendor': './demo/vendor.ts',
    'app': './demo/app/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: 'demo/tsconfig.json' }
          }, 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: [root.root('demo', 'app'), root.root('src')],
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: [root.root('demo', 'app'), root.root('src')],
        loader: 'raw-loader'
      },
      {
        test: require.resolve('socket.io-client'),
        use: [{
          loader: 'expose-loader',
          options: 'io'
        }]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV)
      }
    }),
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        SERVER: JSON.stringify(SERVER),
      }
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root.root('demo'),
      {}
    ),
    new webpack.ContextReplacementPlugin(
      /\@angular(\\|\/)core(\\|\/)esm5/,
      root.root('demo'),
      {}
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    }),
  ]
};