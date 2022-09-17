const webpack = require('webpack');
const path = require('path');

const config = {
    mode: 'development',
    entry: [
        './src/electron-window.js',
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'windowBundle.js'
    },
    watchOptions: {
        // Delay the rebuild after the first change
        aggregateTimeout: 300,
        // Poll using interval (in ms, accepts boolean too)
        poll: 1000
    },
    cache: true,
    devtool: 'eval-source-map',
}

module.exports = config;
