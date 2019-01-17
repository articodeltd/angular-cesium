// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  let configuration = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: ['../../node_modules/cesium/Build/Cesium/Cesium.js'],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      'Chrome'
    ],
    singleRun: true,
    proxies: {
      '/assets/': '/node_modules/cesium/Build/'
    },
  };

  // https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-393504570
  // https://juristr.com/blog/2018/02/cd-gitlab-angular-firebase/#step-1-prepare-your-packagejson-scripts
  if (process.env.CI_SERVER) {
    console.log('process.env.CI_SERVER === true');

    configuration.browsers = ['ChromeHeadless'];

    configuration.customLaunchers = {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    };
  }

  config.set(configuration);
};
