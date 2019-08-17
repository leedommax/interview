const path = require("path");

const PATHS = {
	lib: path.join(__dirname, "/test/loader-test.js"),
	build: path.join(__dirname, "build"),
};

module.exports = {
	entry: {
		loaderTest: PATHS.lib,
	},
	output: {
		path: PATHS.build,
		filename: "[name].js",
	},
	module: {
		rules: [{
			test: /\.html$/,
			use: ['html-loader', 'demo-loader'] // 处理顺序 demo-loader => html-loader => webpack
		}]
	},
	resolveLoader: {
		// 因为 html-loader 是开源 npm 包，所以这里要添加 'node_modules' 目录
		modules: [path.join(__dirname, './src'), 'node_modules']
	}
};