/*
	@description: this is a fucking hack to avoid 4KB limits of environement variables
*/

const dotenv = require('dotenv');

/*
	@description: return functions to be used with serverless.yml
	has an inject function to be used at the top of a function

	Error:   Invalid variable syntax when referencing file "./env.js". Check if your javascript is exporting a function that returns a value.
	Means: you've missed at least ONE variable that exists in "serverless.yml" and not in ".env"
*/
module.exports = (props) => {
	let values = dotenv.config();

	let base = {};

	let cacheServerless = undefined;

	let fncs = {};

	//	And noooow we create functions for our variables
	Object.keys(values.parsed).forEach(k => {
		fncs[k] = (serverless) => {
			cacheServerless = serverless;
			let mapped = props.map(k, values.parsed[k], serverless.variables.service.provider.environment);
			console.log(`serverless-fuck-you-4kb - sls - ${k}::${mapped}`);
			return mapped;
		}
	});

	fncs["inject"] = (data) => {
		Object.keys(values.parsed).forEach(k => {
			let mapped = props.map(k, values.parsed[k], cacheServerless.variables.service.provider.environment);
			if (props.log) {
				console.log(`serverless-fuck-you-4kb - inject - ${k}::${mapped}`);
			}
			process.env[k] = mapped;
		});
		if (props.log) {
			console.log(`serverless-fuck-you-4kb - log : ${JSON.stringify(base, null, 2)}`);
		}
	};

	return fncs;
}
