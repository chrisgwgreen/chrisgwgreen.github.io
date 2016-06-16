module.exports = {
    entry: './index.js',
    output: {
        filename: '../app.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015']
            }
        }]
    }
}
