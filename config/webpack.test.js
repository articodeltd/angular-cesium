var root = require('./root-helper');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'

            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            },
            {
                test: /\.css$/,
                exclude: [root.root('demo', 'app'), root.root('src')],
                loader: 'null'
            },
            {
                test: /\.css$/,
                include: [root.root('demo', 'app'), root.root('src')],
                loader: 'raw'
            }
        ],

        exprContextCritical: false
    }
};