const path = require("path");


const PATHS = {
	lib: path.join(__dirname, "/src/demo-plugin.js"),
	build: path.join(__dirname, "dist"),
};

module.exports = {
	entry: {
		plugin: PATHS.lib,
	},
	output: {
		path: PATHS.build,
		filename: "[name].js",
	}
};