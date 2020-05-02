const path = require('path'),
    HTMLWebpackPlugin = require('html-webpack-plugin'),
    {
        CleanWebpackPlugin
    } = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
    TerserWebpackPLugin = require('terser-webpack-plugin'),
    rupture = require('rupture'),
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
    },
    filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`,
    cssLoaders = extra => {
        const loaders = [{
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        }, 'css-loader', 'postcss-loader'];
        if (extra) {
            loaders.push(extra);
        }
        return loaders;
    };
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        analytics: './analytics.js'
    },
    output: {
        filename: filename('js'),
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
            filename: filename('css')
        })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.styl$/,
                use: cssLoaders({
                    loader: 'stylus-loader',
                    options: {
                        use: [rupture()]
                    }
                })
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
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    }
};