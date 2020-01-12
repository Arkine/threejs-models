const production = (process.env.NODE_ENV === 'production') ? true : false;

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// The Webpack Config.
const settings = {
	context: __dirname,
	devtool: (!production) ? 'inline-sourcemap' : false,
	mode: (!production) ? 'development' : 'production',
	target: 'web',
	entry: {
		'scripts': path.resolve(__dirname, `./index.js`),
	},
	resolve: {
		extensions: ['.js', '.jsx', '.scss'],
	},

	output: {
		path: path.resolve(__dirname),
		publicPath: `./`,
		filename: 'dist/bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.(css)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader', options: {
							sourceMap: (!production) ? true : false,
							url: true,
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [require('autoprefixer')],
						}
					}
				],
			},
			// Babel loader for es6 support
			{
				test: /\.(js|jsx)?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [
						'@babel/preset-env'
					],
					plugins: [
						
					],
				},
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	]
};


module.exports = settings;
