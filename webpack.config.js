const { resolve }                = require('path');
const { DefinePlugin }           = require('webpack');
const cssnano                    = require('cssnano');
const HtmlWebpackPlugin          = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TerserPlugin 				 = require('terser-webpack-plugin');
const MiniCssExtractPlugin       = require('mini-css-extract-plugin');
const CopyWebpackPlugin          = require('copy-webpack-plugin')
const BundleAnalyzerPlugin 		 = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
				{
                    test: /\.jsx?$/,
                    loader: 'babel-loader'
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

		resolve: {
            mainFiles: ['index', 'Index'],
            extensions: ['.js', '.jsx']
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
			// Uncomment for the analyzer
			//new BundleAnalyzerPlugin(),
			new MiniCssExtractPlugin({
				filename : 'css/inshapardaz.css'
			}),

			new DefinePlugin({
				'process.env' : {
					NODE_ENV : development ? '"development"' : '"production"'
				}
			}),

			new HtmlWebpackPlugin({
				template: './public/index.html'
			}),

			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute : 'async'
			}),

			new CopyWebpackPlugin([
				{ from : './public', to : '' }
			])
		],

		externals: {
			config : JSON.stringify(process.env.NODE_ENV === 'production' ? require('./config/config.prod.json') : require('./config/config.dev.json'))
		},

		devtool : development ? 'source-map' : false
	};
};
