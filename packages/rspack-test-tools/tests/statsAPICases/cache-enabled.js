const { Stats } = require("@rspack/core");
module.exports = {
	description:
		"should have any cache hits log of modules in incremental rebuild mode",
	options(context) {
		return {
			context: context.getSource(),
			entry: "./fixtures/abc",
			cache: true
		};
	},
	async build(context, compiler) {
		await new Promise((resolve, reject) => {
			compiler.build(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
		await new Promise((resolve, reject) => {
			compiler.rebuild(
				new Set([context.getSource("./fixtures/a")]),
				new Set(),
				err => {
					if (err) {
						return reject(err);
					}
					resolve();
				}
			);
		});
	},
	async check(_, compiler) {
		const stats = new Stats(compiler.compilation).toString({
			all: false,
			logging: "verbose"
		});
		expect(stats).toContain("module build cache: 100.0% (1/1)");
		expect(stats).toContain("module factorize cache: 100.0% (1/1)");
		expect(stats).toContain("module code generation cache: 100.0% (4/4)");
	}
};
