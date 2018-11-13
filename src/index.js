/*
	@description: this is a fucking hack to avoid 4KB limits of environement variables
*/

const dotenv = require('dotenv');

module.exports = (props) => {
	let values = dotenv.config();

	let base = {};

	Object.keys(values.parsed).forEach((k) => {
		base[k] = props.map(k, values.parsed[k]);
	});

	if (props.log) {
		console.log(`serverless-fuck-you-4kb - log : ${JSON.stringify(base, null, 2)}`);
	}

	let fncs = {};

	//	And noooow we create functions for our variables
	Object.keys(base).forEach(k => {
		fncs[k] = () => {
			return base[k];
		}
	});

	fncs["inject"] = () => {
		Object.keys(base).forEach(k => {
			process.env[k] = base[k];
		});
	};

	return fncs;
}
