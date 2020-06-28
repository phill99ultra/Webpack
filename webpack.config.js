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
                },
                // {
                //     from: `${PATHS.src}/${PATHS.assets}/fonts`,
                //     to: `${PATHS.dist}/${PATHS.assets}/fonts`
                // }
                // {
                //     from: `${PATHS.src}/images`,
                //     to: `${PATHS.dist}/images`
                // }
            ]),
            new MiniCssExtractPlugin({
                filename: `${PATHS.assets}css/${filename('css')}`
            })
        ];
        if (isProd) {
            base.push(new BundleAnalyzerPlugin());
        }
        return base;
    };
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        analytics: './analytics.js'
    },
    output: {
        filename: `${PATHS.assets}js/${filename('js')}`,
        // path: path.resolve(__dirname, 'dist')
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
        hot: isDev,
        overlay: true
    },
    devtool: isDev ? 'sourcemap' : '',
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
                // Method using url-loader
                // use: [{
                //     loader: 'url-loader?limit=100000',
                //     options: {
                //         publicPath: './fonts/',
                //         name: '../fonts/[name].[ext]',                        
                //     }
                // }]
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