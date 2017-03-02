var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const helpers = require('./helpers');
var path = require("path");

module.exports = {
    entry: {
        "polyfills": "./angular2App/polyfills.ts",
        "vendor": "./angular2App/vendor.ts",
        "app": "./angular2App/app/main.ts"
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery",            
            'jquery-ui': 'jquery-ui-bundle/jquery-ui',
            'jquery-ui-css': 'jquery-ui-bundle/jquery-ui.css',
            'waves': './angular2App/app/plugins/waves.js'
        },
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html']
    },

    devtool: 'source-map',

    output: {
        path: "./wwwroot",
        filename: "js/[name]-[hash:8].bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&&name=assets/[name]-[hash:6].[ext]&mimetype=application/font-woff"
            },
            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader?name=assets/[name]-[hash:6].[ext]"
            },
            {
                test: /\.(png|jpg|gif|ico)$/,
                loader: "file-loader?name=assets/[name]-[hash:6].[ext]"
            },
            {
                test: /\.component\.css$/,
                loader: 'raw'
			},

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('to-string', 'css?sourceMap', { publicPath: '../' })
            },


            {
                test: /\.scss$/,
                loaders: ['raw', 'sass']
            }

        ]

    },

    plugins: [
        new ExtractTextPlugin("css/[name]-[hash:8].bundle.css"),
        new ForkCheckerPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor", "polyfills"]
        }),
        new CleanWebpackPlugin(
            [
                "./wwwroot/js/",
                "./wwwroot/css/",
                "./wwwroot/index.html"
            ]
        ),
        // inject in index.html
        new HtmlWebpackPlugin({
            template: "./angular2App/index.html",
            inject: "body"
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            "window.jQuery":"jquery",
            Tether: 'tether',
            waves: 'waves',
            Waves: 'waves',

        })
    ],
    devServer: {
        historyApiFallback: true,
        stats: "minimal"
    }
};