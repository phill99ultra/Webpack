const path = require('path'),
    PATHS = {
        src: path.join(__dirname, './src'),
        dist: path.join(__dirname, './dist'),
        assets: 'assets/'
    },
    //Aditional Plugins
    HTMLWebpackPlugin = require('html-webpack-plugin'),
    {
        CleanWebpackPlugin
    } = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'),
    TerserWebpackPLugin = require('terser-webpack-plugin'),
    {
        BundleAnalyzerPlugin
    } = require('webpack-bundle-analyzer'),
    rupture = require('rupture'),
    isDev = process.env.NODE_ENV === 'development',
    isProd = !isDev,
    optimization = () => {
        const config = {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    commons: {
                        name: 'commons',
                        chunks: 'initial',
                        minChunks: 2
                    }
                }
            }
        };
        if (isProd) {
            config.minimizer = [
                new OptimizeCssAssetsWebpackPlugin(),
                new TerserWebpackPLugin(),
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
        }, {
            loader: 'css-loader',
            options: {
                sourceMap: true
            }
        }, {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    path: 'src/postcss.config.js'
                }
            }
        }];
        if (extra) {
            loaders.push(extra);
        }
        return loaders;
    },
    babelOptions = preset => {
        const opts = {
            presets: [
                '@babel/preset-env'
            ],
            plugins: [
                '@babel/plugin-proposal-class-properties'
            ]
        };
        if (preset) {
            opts.presets.push(preset);
        }
        return opts;
    },
    jsLoaders = () => {
        const loaders = [{
            loader: 'babel-loader',
            options: babelOptions()
        }];
        if (isDev) {
            loaders.push('eslint-loader');
        }
        return loaders;
    },
    plugins = () => {
        const base = [
            new MiniCssExtractPlugin({
                filename: `${PATHS.assets}css/${filename('css')}`
            }),
            new HTMLWebpackPlugin({
                // template: './pug/layout/main.pug',
                hash: false,
                template: `${PATHS.src}/index.html`,
                filename: './index.html',
                // title: 'Webpack Build',
                minify: {
                    collapseWhitespace: isProd
                }
            }),
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([{
                from: `${PATHS.src}/static`,
                to: `${PATHS.dist}/static`
            }])
        ];
        if (isProd) {
            base.push(new BundleAnalyzerPlugin());
        }
        return base;
    };
module.exports = {
    context: path.resolve(__dirname, 'src'),
    externals: {
        paths: PATHS
    },
    entry: {
        main: PATHS.src,
        // analytics: './analytics.js'
    },
    output: {
        filename: `${PATHS.assets}js/${filename('js')}`,
        path: PATHS.dist,
        publicPath: '/'
    },
    optimization: optimization(),
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    devtool: isDev ? 'sourcemap' : false,
    plugins: plugins(),
    module: {
        rules: [{ // for CSS files
                test: /\.css$/,
                use: cssLoaders()
            },
            { // for Stylus files
                test: /\.styl$/,
                use: cssLoaders({
                    loader: 'stylus-loader',
                    options: {
                        use: [rupture()]
                    }
                })
            },
            // {
            //     test: /\.pug$/,
            //     use: [{
            //         loader: 'pug-loader',
            //         options: {
            //             pretty: true,
            //             exports: false
            //         }
            //     }]
            // },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attributes: {
                            list: [{
                                // Tag name
                                tag: 'img',
                                // Attribute name
                                attribute: 'src',
                                // Type of processing, can be `src` or `scrset`
                                type: 'src',
                            }]
                        }
                    }
                }]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name][hash].[ext]'
                    }
                }]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: '../fonts/',
                        outputPath: './assets/fonts'
                    }
                }]
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
                use: jsLoaders()
            }
        ]
    }
};