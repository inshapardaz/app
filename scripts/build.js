const { join }         = require('path');
const { remove, copy } = require('fs-extra');
const { exec }         = require('npm-run');
const config           = require('../deploy/configs/config.json');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function isEnvironment (environment)
{
	return environment !== 'common' && environment !== 'development';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function webpack (pathToBuild)
{
	return new Promise((resolve, reject) =>
	{
		exec(`webpack --env.output ${pathToBuild}`, (error, stdout, stderr) =>
		{
			if (error)
			{
				console.error(stderr);

				reject(
					new Error(`Webpack failed with code ${error.code}.`)
				);
			}
			else
			{
				console.log(stdout);

				resolve();
			}
		});
	});
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function createArtifact (pathToBuild, {
	tenants,
	environment,
	team
})
{
	const pathToArtifact = join('artifact', environment);

	await copy(pathToBuild, pathToArtifact);

	await remove(`${pathToArtifact}/index.html.hbs`);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function build ()
{
	await webpack('build');

	const environments = Object.keys(config);

	for (let environment of environments)
	{
		if (isEnvironment(environment))
		{
			const { tenants, team } = config[environment];

			await createArtifact('build', {
				tenants, environment, team
			});
		}
	}

	await remove('build');
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

build()

	.then(() =>
	{
		console.log('Build was successful.');
	})

	.catch(error =>
	{
		console.error(error.message);

		// Fail.
		process.exitCode = 1;
	});
