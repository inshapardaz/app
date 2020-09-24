const { resolve }                  = require('path');
const express                      = require('express');
const webpackDevelopmentMiddleware = require('webpack-dev-middleware');
const webpack                      = require('webpack');
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

	.use('/api/files', express.static(
		resolve('serve/api/files/6648.jpg'), {
			extensions : ['jpg', 'jpeg']
		}
	))

	.use('/api', express.static(
		resolve('serve/api'), {
			extensions : ['json'], index : 'index.json'
		}
	))

	.use('/resources', express.static(
		resolve('public/resources')
	))

	.use('*', (request, response) =>
	{
		response.sendFile(
			resolve('development/app/index.html')
		);
	})

	.listen(4200, error =>
	{
		if (error)
		{
			console.error(`Could not start development server on port 4200. ${error}`);

			return;
		}

		console.log('Development server has started on port 4200. Wait for the initial build to finish and then generate configuration.');
	});
