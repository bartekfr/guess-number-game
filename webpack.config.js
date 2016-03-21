module.exports =  {
	entry: __dirname + "/js/main.js",
	output: {
		path: __dirname + '/dist',
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			loader: 'babel',
			exclude: /node_modules/,
			test: /\.js/,
			query: {
				presets: ['es2015'],
				plugins: ["transform-object-assign"]
			}
		}]
	}
}