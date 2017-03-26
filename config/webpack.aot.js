var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

var root = require('./root-helper');

module.exports = {
    entry: {
        'main': './src/main.js'
    },

    output: {
        path: root.root('bundles'),
        filename: 'angular-cesium.umd.js',
        libraryTarget: 'umd'
    },

    externals: [nodeExternals()],

    target: 'node',

    module: {
        loaders: [
            {
                test: /.js$/,
                exclude: root.root('node_modules'),
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-es2015-modules-commonjs']
                }
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            {from: './*.html', context: 'src', to: './'},
            {from: './**/*.html', context: 'src', to: './'},
            {from: './*.css', context: 'src', to: './'},
            {from: './**/*.css', context: 'src', to: './'}
        ])
    ],

    resolve: {
        extensions: ['', '.js'],
        alias: {
            'cesium': 'cesium/Build/CesiumUnminified/Cesium.js'
        }
    },

    stats: 'errors-only',

    devtool: 'source-map'
};