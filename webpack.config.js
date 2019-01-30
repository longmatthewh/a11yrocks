const path = require('path');
const webpack = require('webpack');

module.exports = {
 	entry:  './src/js/colorPalette/index.jsx',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'build.js'
    },
    devServer: {
        contentBase:'./js',
        overlay: true,
        hot:true,
        disableHostCheck: true,
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },

                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            modules: true,
                            url: false,
                            localIdentName: '[local]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')({browsers: ['last 2 versions']})
                            ]
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    }
};