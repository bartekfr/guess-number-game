module.exports =  {
	entry: __dirname + "/js/main.js",
	output: {
		path: __dirname + '/dist',
		filename: "bundle.js",
		publicPath: '/dist'
	},
	devtool: '#source-map',
	module: {
		rules: [{
			exclude: /node_modules/,
			test: /\.js/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['es2015'],
					plugins: ["transform-object-assign", "transform-object-rest-spread"]
				}
			}]
		}]
	}
}