/*
	@description: this is a fucking hack to avoid 4KB limits of environement variables
*/

const dotenv = require('dotenv');
const fs = require("fs");

// function syncGeneratedVariables(serverless) {
// 	let file = `
// 	module.exports = ${JSON.stringify(serverless.variables.service.provider.environment, null, 2)}
// `;
// 	fs.writeFileSync("./environement.js", file);
// }

// function getGeneratedVariables() {
// 	return require("../environement")
// }

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

			// does it useless ??????
			if (!cacheServerless) {
				cacheServerless = serverless;
				// syncGeneratedVariables(cacheServerless);
			}

			// Where can i find a promise to compute deep variable ?
			// console.log(serverless.variables.populateObject(serverless.service.provider.environment))
			// console.log(serverless.variables)
			// Yup... that's dirty and i like it.
			// does it useless ???
			// let deeps = cacheServerless.variables.deep;

			let mapped = props.map(k, values.parsed[k], cacheServerless.variables.service.provider.environment);

			// deeps.forEach((d, i) => {
			// 	console.log(i, d);
			// 	if (mapped.indexOf("${deep:"+i+"}") > -1) {
			// 		// replace it
			// 		mapped = mapped.replace("${deep:"+i+"}", d);
			// 	}
			// })

			// console.log(`serverless-fuck-you-4kb - sls - ${k}::${mapped}`);
			return mapped;
		}
	});

	fncs["inject"] = (data) => {
		try {
			// console.log("values.parsed", values);
			// if (cacheServerless) {
			// 	console.log(
			// 		"cacheServerless.variables.service.provider.environment",
			// 		cacheServerless.variables.service.provider.environment
			// 	);
			// }

			// Object.keys(process.env).forEach((k) => {
			//     console.log(`process.env.${k} - ${process.env[k]}`);
			// })

			Object.keys(values.parsed).forEach(k => {
				let mapped = props.map(k, values.parsed[k],
					cacheServerless ? cacheServerless.variables.service.provider.environment : process.env
				);
				if (props.log) {
					console.log(`serverless-fuck-you-4kb - inject - ${k}::${mapped}`);
				}
				process.env[k] = mapped;
			});
			if (props.log) {
				console.log(`serverless-fuck-you-4kb - log : ${JSON.stringify(base, null, 2)}`);
			}
		} catch(e) {
			console.log("error ", e);
		}
	};

	return fncs;
}
