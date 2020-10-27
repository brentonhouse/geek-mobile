module.exports = async function (opts) {
	process.stdout.write(`example hook running ${opts.id}\n`);
	global.config = opts.config;
};
