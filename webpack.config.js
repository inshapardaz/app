const { resolve }                = require('path');
const { DefinePlugin }           = require('webpack');
const cssnano                    = require('cssnano');
const HtmlPlugin                 = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TerserPlugin 				 = require('terser-webpack-plugin');
const MiniCssExtractPlugin       = require('mini-css-extract-plugin');
const CopyWebpackPlugin          = require('copy-webpack-plugin')

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function ({ output, development = false } = {})
{
	return {

		mode : development ? 'development' : 'production',

		entry :
		{
			boot : ['./src/index.scss', './src/index.jsx']
		},

		output :
		{
			path : resolve(output),
			filename : 'js/inshapardaz.js',
			chunkFilename : 'js/modules/[chunkhash].js',
			library : 'inshapardaz'
		},

		module :
		{
			rules :
			[
				{ // JavaScript.
					test : /\.(js|jsx)$/,
					use : [
						{
							loader : 'babel-loader'
						}
					],
					exclude : /(node_modules)/,
				},

				{ // Stylesheets.
					test : /\.scss$/,
					use : [
						MiniCssExtractPlugin.loader,
						{
							loader : 'css-loader',
							options : {
								sourceMap : true
							}
						},
						{
							loader : 'postcss-loader',
							options : {
								plugins : [
									cssnano()
								],
								sourceMap : true
							}
						},
						{
							loader : 'sass-loader',
							options : {
								sourceMap : true
							}
						},
					]
				},

				{ // Assets.
					test : /\.(png|svg?)(\?[a-z0-9=&.]+)?$/,
					use : [
						{
							loader : 'base64-inline-loader',
							options : {
								name : '[name].[ext]'
							}
						}
					]
				}
			]
		},

		performance :
		{
			hints : false
		},

		optimization : {
			minimizer : [new TerserPlugin()],
		},

		plugins :
		[
			new MiniCssExtractPlugin({
				filename : 'css/inshapardaz.css'
			}),

			new DefinePlugin({
				'process.env' : {
					NODE_ENV : development ? '"development"' : '"production"'
				}
			}),

			new HtmlPlugin({
				filename : 'index.html.hbs',
				hash : true,
				template : './src/index.html.hbs'
			}),

			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute : 'async'
			}),

			new CopyWebpackPlugin([
				{ from : './src/resources', to : 'resources' },
				{ from : './public', to : '' }
			])
		],

		externals: {
			'Config': JSON.stringify(process.env.NODE_ENV === 'production' ? require('./config/config.prod.json') : require('./config/config.dev.json'))
		},

		devtool : development ? 'source-map' : false
	};
};
