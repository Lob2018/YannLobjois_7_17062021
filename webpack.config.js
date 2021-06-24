const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        polyfill: "babel-polyfill", // transpiler avec babel
        app: "./src/index.js" // point d'entrée de app 
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: __dirname,
    },
    module: {
        rules: [{
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        postcssOptions: {
                            plugins: function() { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.js$/, // tous les fichiers js
                exclude: /node_modules/, // sauf js de node modules
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    output: {
        filename: "[name].bundle.js", // bundler dans ./dist/app.bundle.js
        path: __dirname
    },
    performance: {
        hints: false // retire les warnings
    }
};