module.exports = {
	context: __dirname,
	entry: "./src/app.js",
	output: {
		filename: "static/js/app.js"
	},
	module: {
		loaders: [
			{
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
              presets: ['react', 'es2015']
          }
      }
		]
	}
}
