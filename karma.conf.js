const isCI = require('is-ci');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function (config)
{
	config.set({

		files : [
			{ pattern : 'tests/integration/Runner.js', served : true, included : true },
			{ pattern : 'src/resources/**/*', served : true, included : false }
		],

		proxies : {
			'/resources' : '/base/src/resources'
		},

		browsers : [
			'Electron'
		],

		frameworks : [
			'mocha',
			'source-map-support'
		],

		reporters : [
			isCI ? 'teamcity' : 'mocha'
		],

		mochaReporter :
		{
			showDiff : true
		},

		preprocessors : {
			'tests/integration/Runner.js' : ['webpack']
		},

		client : {

			mocha : {
				timeout : 5000
			},

			logging : config.logging
		},

		webpack : {
			mode : 'development',

			module : {
				rules : [
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
					},

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
							{
								loader : 'style-loader',
								options : {
									sourceMap : true
								}
							},
							{
								loader : 'css-loader',
								options : {
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
					}
				]
			},

			devtool : 'inline-source-map'
		}
	});
};
