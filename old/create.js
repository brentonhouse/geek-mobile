const { Command, flags } = require(`@oclif/command`);

const app = require(`./create/app`);

class CreateCommand extends Command {
	async run() {
		const { flags } = this.parse(CreateCommand);
		const name = flags.name || `world`;
		this.log(`hello ${name} from /Users/bhouse/area51/brentonhouse/geek-mobile/src/commands/create.js`);

		await app.run([  ]);
	}
}

CreateCommand.description = `Describe the command here
...
Extra documentation goes here
`;

CreateCommand.flags = app.flags;

module.exports = CreateCommand;
