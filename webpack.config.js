const path = require('path'),
    HTMLWebpackPlugin = require('html-webpack-plugin'),
    {
        CleanWebpackPlugin
    } = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
    TerserWebpackPLugin = require('terser-webpack-plugin'),
    isDev = process.env.NODE_ENV === 'development',
    isProd = !isDev,
    optimization = () => {
        const config = {
            splitChunks: {
                chunks: 'all'
            }
        };
        if (isProd) {
            config.minimizer = [
                new OptimizeCssAssetsWebpackPlugin(),
                new TerserWebpackPLugin()
            ];
        }
        return config;
    };
console.log('Is dev:',
    isDev);
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4444,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            // title: 'Webpack build of Fill',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/favicon.ico'),
            to: path.resolve(__dirname, 'dist')
        }]),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    }
                }, 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            }
        ]
    }
};