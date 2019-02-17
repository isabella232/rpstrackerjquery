const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log('OUTPUT: ' + path.join(__dirname, 'dist'));

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        backlog: './src/backlog/index.ts'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8081
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                //exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {}
                }]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/backlog/**', to: 'backlog/', flatten: true },
        ],
            { ignore: ['**/*.js', '**/*.css', '**/*.ts'] }
        ),
        new CopyWebpackPlugin([
            { from: 'src/detail/**', to: 'detail/', flatten: true },
        ],
            { ignore: ['**/*.js', '**/*.css', '**/*.ts'] }
        ),

    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    //target: 'node',
    //externals: [nodeExternals()],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    chunks: "all",
                    test: (module, chunks) => {
                        const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                        return /[\\/]node_modules[\\/]/.test(moduleName);
                    },
                    enforce: true,
                },
            }
        }
    }
};
