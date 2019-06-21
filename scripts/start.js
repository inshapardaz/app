const { resolve }                  = require('path');
const express                      = require('express');
const webpackDevelopmentMiddleware = require('webpack-dev-middleware');
const webpack                      = require('webpack');
const config                       = require('../configs/config.json');
const configure                    = require('../webpack.config');
const { generateConfig }           = require('./generateConfig');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

express()

	.use(
		webpackDevelopmentMiddleware(
			webpack(
				configure({ output : 'development/app', development : true })
			),
			{ writeToDisk : true }
		)
	)

	// Allow for client routing.
	.use('*', (request, response) =>
	{
		response.sendFile(
			resolve('development/app/index.html')
		);
	})

	.listen(4300, error =>
	{
		if (error)
		{
			console.error(`Could not start development server on port 4300. ${error}`);

			return;
		}

		console.log('Development server has started on port 4300. Wait for the initial build to finish and then generate configuration.');
		const data = { ...config.common, ...config.development };
		generateConfig('development/app/index.html.hbs', data);
	});
