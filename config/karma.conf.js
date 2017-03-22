var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            {pattern: './config/karma-test-shim.js', watched: false},
            {
                pattern: './node_modules/cesium/Build/Cesium/Widgets/Images/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Widgets/InfoBox/*.css',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/**/*.svg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/*.json',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/**/*.json',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Workers/*.js',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/Textures/SkyBox/*.jpg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            },
            {
                pattern: './node_modules/cesium/Build/Cesium/Assets/Textures/*.jpg',
                watched: false,
                included: false,
                served: true,
                nocache: false
            }
        ],

        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap']
        },

        proxies: {
            '/assets/': '/node_modules/cesium/Build/'
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS',
                    // 'Chrome'
        ],
        singleRun: true
    };

    config.set(_config);
};