const webpack = require('webpack'),
    merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.base.config'),
    devWebpackConfig = merge(baseWebpackConfig, {
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            contentBase: baseWebpackConfig.externals.paths.dist,
            mode: 'development',
            port: 8081,
            // hot: isDev,
            overlay: true
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map'
            })
        ]
    });

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig);
});