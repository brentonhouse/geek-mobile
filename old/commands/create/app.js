const { Command, flags } = require(`@oclif/command`);

class CreateAppCommand extends Command {
	async run() {
		const { flags } = this.parse(CreateAppCommand);
		const name = flags.name || `world`;
		this.log(`hello ${name} from /Users/bhouse/area51/brentonhouse/geek-mobile/src/commands/create/app.js`);
	}
}

CreateAppCommand.description = `Describe the command here
...
Extra documentation goes here
`;


CreateAppCommand.flags = {
	name:  flags.string({ char: `n`, description: `name to print` }),
	test2: flags.string({ char: `t2`, description: `test2` }),
};

module.exports = CreateAppCommand;
