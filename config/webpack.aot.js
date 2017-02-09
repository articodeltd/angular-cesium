var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var root = require('./root-helper');

module.exports = {
    entry: {
        'main': './dist/main.js'
    },

    output: {
        path: root.root('dist'),
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript?tsconfig=tsconfig.aot.json',
                    'angular2-template'
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw',
                include: [
                    root.root('src')
                ],
                loaders: ['required-loader']
            },
            {
                test: /\.html$/,
                loaders: 'html-loader'
            },
            {
                test: /\.css$/,
                loaders: ['to-string-loader', 'css-loader']
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
        extensions: ['', '.ts', '.js'],
        alias: {
            'angular2-grid': 'angular2-grid/dist/main.js'
        }
    },

    stats: 'errors-only',

    devtool: 'source-map'
};