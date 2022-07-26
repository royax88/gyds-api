module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'requirejs', 'chai'],
        files: [
            './node_modules/promise-polyfill/promise.js',
            {pattern: './config.js', included: true},
            {pattern: './main.js', included: true}
        ],
        exclude: [
        ],
        preprocessors: {
            './**/src/**/*.ts': ['coverage']
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        coverageReporter: {
            dir: './coverage',
            type: ['text-summary','html'],
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: false            
        },
        reporters: ['progress', 'coverage', 'junit'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'],
        autoWatch: true,
        singleRun: false
    })
}
