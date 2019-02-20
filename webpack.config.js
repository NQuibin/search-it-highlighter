const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/app.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'content.js',
        publicPath: './'
    },

    devServer: {
        historyApiFallback: true,
        publicPath: '/dist'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            {
                                plugins: [
                                    '@babel/plugin-proposal-class-properties'
                                ]
                            }
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new CopyPlugin([
            { from: './src/chrome' },
            { from: './src/assets', to: 'assets' }
        ])
    ],

    watch: true,

    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/
    }
};
