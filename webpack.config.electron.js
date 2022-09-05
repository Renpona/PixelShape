const webpack = require('webpack');

const config = {
    mode: 'development',
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
