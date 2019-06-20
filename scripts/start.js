const { resolve }                  = require('path');
const express                      = require('express');
const webpackDevelopmentMiddleware = require('webpack-dev-middleware');
const webpack                      = require('webpack');
const configure                    = require('../webpack.config');

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

	// Mock API.
	.use('/api/:tenant', express.static(
		resolve('development/api'), {
			extensions : ['json'], index : 'index.json'
		}
	))

	.use('/', express.static(
		resolve('development/app')
	))

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
	});
