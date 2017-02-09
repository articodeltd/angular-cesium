var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var root = require('./root-helper');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: root.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});