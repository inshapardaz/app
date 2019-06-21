/* eslint-disable no-sync */
const fs = require('fs');
const handlebars = require('handlebars');

const readContent = filePath => fs.readFileSync(filePath, 'utf8');

const writeOutput = (filePath, content) =>
{
	console.info(`Generated file: ${filePath}`);
	fs.writeFileSync(filePath, content);
};

function compileTemplateForTenant (template, data)
{
	const compiled = handlebars.compile(template.content);
	const result = compiled(data);
	template.writeOutput(result);
}

module.exports = {
	generateConfig (file, data)
	{
		const template = {
			content : readContent(file),
			writeOutput : result => writeOutput(file.replace('.hbs', ''), result)
		};

		compileTemplateForTenant(template, data);
	}
};
