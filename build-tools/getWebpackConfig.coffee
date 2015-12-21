WebpackErrorNotificationPlugin = require 'webpack-error-notification'
autoprefixer = require 'autoprefixer'
webpack = require 'webpack' # Coincidence? I don't think so ;)
poststylus = require 'poststylus'
postcssShort = require 'postcss-short'

module.exports = (options) ->
	entry:
		panel: ['./src/panel/panel.coffee']
		commands: ['./src/commands/commands.coffee']

	output:
		path: './dist'
		filename: '[name].dist.js'
		publicPath: '/dist/'

	plugins: [
		new webpack.NoErrorsPlugin()
		new WebpackErrorNotificationPlugin()
	]

	resolve:
		extensions: ['', '.js', '.json', '.coffee']

	module:
		loaders: [
			{test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=100000'}
			{test: /\.coffee$/, loader: 'coffee-loader'}
			{test: /\.json$/, loader: 'json-loader'}
			{test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'}
		]

	stylus:
		use: [
			poststylus([autoprefixer(), postcssShort()])
		]