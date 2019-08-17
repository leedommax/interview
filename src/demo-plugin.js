const { RawSource } = require("webpack-sources");

module.exports = class DemoPlugin {
	constructor(options) {
		this.options = options
	}
	apply(compiler) {
		const { name } = this.options;

		compiler.plugin('emit', (compilation, next) => {
			compilation.assets[name] = new RawSource("demo");
		next()
	})
	}
}