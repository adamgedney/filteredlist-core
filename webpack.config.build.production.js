import path         from 'path';
import merge        from 'webpack-merge';

import UglifyJsPlugin from 'webpack-uglify-js-plugin';

import baseConfig   from './webpack.config.build.base';

export default merge(
    baseConfig,
    {
        output: {
            filename: "index.min.js",
        },
        devtool: 'source-map',
        // plugins: [new UglifyJsPlugin({
        //     // sourceMap: true,
        //     output: {
        //         comments: false
        //     },
        //     cacheFolder: path.resolve(__dirname, '.tmp/'),
        //     minimize: true }
        // )]
    }
);