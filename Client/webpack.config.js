'use strict';

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    devtool: "source-map",
    resolve: { 
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css']
    },
    externals: {
        'react': 'React', 'react-dom': 'ReactDOM' 
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'], exclude: /node_modules/ },
            { test: /\.ts$/, use: [{ loader: 'babel-loader' }, { loader: 'ts-loader', options: { transpileOnly: true } }], exclude: /node_modules/ },
            { test: /\.tsx$/, use: [{ loader: 'babel-loader' }, { loader: 'ts-loader', options: { transpileOnly: true } }], exclude: /node_modules/ },

            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    }
};
