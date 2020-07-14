const merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.base.config'),
    buildWebpackConfig = merge(baseWebpackConfig, {
        mode: 'production',
        plugins: []
    });

module.exports = new Promise((resolve) => {
    resolve(buildWebpackConfig);
});