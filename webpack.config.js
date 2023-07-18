const webpack = require('webpack')
module.exports = {
    entry: `./src/index.js`,

    output: {
        filename: "main.js"
    },
    mode: "development",
    resolve: {
        fallback: {
            "assert": require.resolve("assert"),
        }
    },
    devServer: {
        static: "dist",
        open: true
    },
    plugins: [
        // fix "process is not defined" error:
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ]
};