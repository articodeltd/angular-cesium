module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'angular-cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-remap-istanbul'),
            require('angular-cli/plugins/karma')
        ],
        files: [
            {pattern: './node_modules/cesium/Build/Cesium/Cesium.js', watched: false},
            //{ pattern: './node_modules/cesium/Build/CesiumUnminified/Cesium.js', watched: false }, // Uncomment if you wanna work with the unminified version of cesium.
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
            },
            {pattern: './src/test.ts', watched: false}
        ],
        preprocessors: {
            './src/test.ts': ['angular-cli']
        },
        proxies: {
            '/assets/': '/base/node_modules/cesium/Build/'
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        remapIstanbulReporter: {
            reports: {
                html: 'coverage',
                lcovonly: './coverage/coverage.lcov'
            }
        },
        angularCli: {
            config: './angular-cli.json',
            environment: 'dev'
        },
        reporters: config.angularCli && config.angularCli.codeCoverage
            ? ['progress', 'karma-remap-istanbul']
            : ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    });
};