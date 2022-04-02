/* eslint-disable global-require */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
	const isProduction = env.production;
	const configTarget = isProduction ? 'prod' : env.TARGET_ENV || 'dev';

	console.log(`Building with configuration target ${configTarget}`);

	return ({
		entry: './src/index.jsx',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
			chunkFilename: '[id].[chunkhash].js',
			publicPath: '/',
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@material-ui/core/TextField': path.resolve(__dirname, 'node_modules/@mui/material/TextField'),
			},
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					use: ['babel-loader', 'source-map-loader'],
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(png|jpe?g|gif)$/,
					use: 'file-loader',
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: `${__dirname}/src/index.html`,
				filename: 'index.html',
				inject: 'body',
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: './public', to: '' },
				],
			}),
		],
		externals: {
			config: JSON.stringify(require(`./config/config.${configTarget}.json`)),
		},
		devtool: isProduction ? 'source-map' : 'inline-source-map',
		devServer: {
			historyApiFallback: true,
		},
	});
};
