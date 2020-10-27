const Promise = require(`bluebird`);
const _ = require(`lodash`);
const path = require(`path`);
const { Command, flags } = require(`@oclif/command`);
// const { BaseCommand } = require(`oclif-plugin-base`);
const BaseCommand = require(`../../BaseCommand`);
const compositeConfig = BaseCommand.config;
const spinner = new (require(`@geek/spinner`))();
const module_name = path.parse(module.id).name;
const chalk = require(`chalk`);
// const fs = Promise.promisifyAll(require(`fs-extra`));
const fs = require(`fs-extra`);
const pathExists = require(`path-exists`);
const temp = require(`temp`);
const findit = require(`findit`);
const { using } = Promise;
// const npm = require(`@geek/npm`);
const globby = require(`globby`);
// const colors = require(`colors`);
const multimatch = require(`multimatch`);
const asyncExec = require(`util`).promisify(require(`child_process`).exec);
const inquirer = require(`inquirer`);
// const { prompt } = require(`enquirer`);

// const logger = func_name => {
// 	const prefix = func_name ? `[${module_name}.${func_name}] ` : `[${module_name}`;
// 	return _.wrap(require(`debug`)(`hero`), (func, msg) => func(chalk.blue(prefix) + msg));
// };

const logger = console;

// const { debug } = logger;
const debug = () => {};

class CreateCommand extends BaseCommand {
	async run() {

		logger.debug(`📌  you are here → CreateCommand.run()`);

		const { args, flags } = this.parse(CreateCommand);


		// logger.debug(`📌  you are here → CreateCommand.run() 2`);


		// args.template = args.template || flags.template || compositeConfig.template || `@titanium/template-alloy-default`;
		this.checkRequiredArgs(CreateCommand.args, args, flags, [ `name` ]);

		args.currentYear = new Date().getFullYear();


		const system_defaults = {
			publisher:       `my-company`,
			description:     `Another awesome Titanium app!`,
			url:             `https://axway.com`,
			author_email:    `nobody@nowhere.com`,
			template:        `@titanium/template-turbo-default`,
			github_username: `my-github-username`,
			repo_type:       `git`,
			license:         `MIT`,
		};


		_.defaults(args, flags, compositeConfig, system_defaults);

		logger.debug(`🦠  args: ${JSON.stringify(args, null, 2)}`);

		// args.publisher = `test`;

		const answers = await inquirer.prompt([
			{
				name:     `name`,
				message:  _.find(CreateCommand.args, { name: `name` }, {}).description,
				type:     `input`,
				default:  args.name,
				// when:     !(args.publisher || compositeConfig.publisher),
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Name can't be empty`; }
					if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Name can only contain alphanumeric or the following characters: '-_'`; }
					answers.safe_name = value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, ``);
					answers.safe_name = answers.safe_name.replace(/[-_]+/g, `.`);
					answers.safe_name = answers.safe_name.replace(/(.*)\.$/, `$1`);
					return true;
			  },
			  filter: (value, answers) => {
					// logger.debug(`🦠  filter value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  filter answers: ${JSON.stringify(answers, null, 2)}`);
					return _.trim(value);
					// if (_.isEmpty(_.trim(value))) { return `id can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					// return true;
			  },
			},
			{
				name:     `publisher`,
				message:  CreateCommand.flags.publisher.description,
				type:     `input`,
				default:  args.publisher,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Publisher can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					answers.safe_publisher = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ``);
					return true;
			  },
			  filter: (value, answers) => {
					// logger.debug(`🦠  filter value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  filter answers: ${JSON.stringify(answers, null, 2)}`);
					return _.trim(value);
				// if (_.isEmpty(_.trim(value))) { return `id can't be empty`; }
				// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
				// return true;
		  		},
			 },
			{
				name:     `id`,
				message:  CreateCommand.flags.id.description,
				type:     `input`,
				default:  answers => args.id || `${answers.safe_publisher}.${answers.safe_name}`,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  validate value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  validate answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `id can't be empty`; }
					if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					return true;
			  },
				filter: (value, answers) => {
					// logger.debug(`🦠  filter value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  filter answers: ${JSON.stringify(answers, null, 2)}`);
					// if (_.isEmpty(_.trim(value))) { return `id can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					// return true;

					return _.trim(value).replace(/[^A-Za-z0-9.]+/g, ``);
			  },
			 },
			{
				name:     `path`,
				message:  CreateCommand.flags.path.description,
				type:     `input`,
				default:  answers => path.join(process.cwd(), answers.name),
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  validate value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  validate answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `path can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					return true;
			  },
			 },
			{
				name:     `description`,
				message:  CreateCommand.flags.description.description,
				type:     `input`,
				default:  args.description,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  validate value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  validate answers: ${JSON.stringify(answers, null, 2)}`);
					// if (_.isEmpty(_.trim(value))) { return `path can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					return true;
			  },
			 },
			{
				name:    `guid`,
				message: CreateCommand.flags.guid.description,
				type:    `input`,
				default: () => {
					if (args.guid === `empty-guid`) {
						return `00000000-0000-0000-0000-000000000000`;
					} else if (_.isNil(args.guid)) {
						const uuidv4 = require(`uuid/v4`);
						return uuidv4();
					}
				},
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  validate value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  validate answers: ${JSON.stringify(answers, null, 2)}`);
					// if (_.isEmpty(_.trim(value))) { return `path can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					return true;
			  },
			 },
			 {
				name:     `copyright`,
				message:  CreateCommand.flags.copyright.description,
				type:     `input`,
				default:  answers => args.copyright || `Copyright (c) ${args.currentYear} ${answers.publisher}`,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  validate value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  validate answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `path can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9.]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '.'`; }
					return true;
			  },
			 },
			 {
				name:     `url`,
				message:  CreateCommand.flags.url.description,
				type:     `input`,
				default:  args.url,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Url can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			 {
				name:     `author_name`,
				message:  CreateCommand.flags.author_name.description,
				type:     `input`,
				default:  answers => args.author_name  || answers.publisher,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Author name can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			 {
				name:     `author_email`,
				message:  CreateCommand.flags.author_email.description,
				type:     `input`,
				default:  args.author_email,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Author email name can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			 {
				name:     `author_url`,
				message:  CreateCommand.flags.author_url.description,
				type:     `input`,
				default:  answers => args.author_url || answers.url,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Author url name can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			 {
				name:     `template`,
				message:  CreateCommand.flags.template.description,
				type:     `input`,
				default:  args.template,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Template name can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			 {
				name:     `github_username`,
				message:  CreateCommand.flags.github_username.description,
				type:     `input`,
				default:  args.github_username,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Github username can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			{
				name:     `repo_url`,
				message:  CreateCommand.flags.repo_url.description,
				type:     `input`,
				default:  answers => `github:${args.github_username}/${answers.name}`,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Repo URL can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			{
				name:     `bugs_url`,
				message:  CreateCommand.flags.bugs_url.description,
				type:     `input`,
				default:  answers =>  `https://github.com/${args.github_username}/${answers.name}/issues`,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Bugs URL can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			{
				name:     `bugs_email`,
				message:  CreateCommand.flags.bugs_email.description,
				type:     `input`,
				default:  answers =>  args.bugs_email || answers.author_email,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `Bugs email can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
			{
				name:     `license`,
				message:  CreateCommand.flags.license.description,
				type:     `input`,
				default:  args.license,
				// when:     !(args.publisher || compositeConfig.publisher),
				// when:     false,
				validate: (value, answers) => {
					// logger.debug(`🦠  value: ${JSON.stringify(value, null, 2)}`);
					// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);
					if (_.isEmpty(_.trim(value))) { return `License can't be empty`; }
					// if (_.trim(value).match(/[^A-Za-z0-9-_]+/g)) { return `Publisher can only contain alphanumeric or the following characters: '-_'`; }
					return true;
			  },
			},
		]);

		// logger.debug(`🦠  answers: ${JSON.stringify(answers, null, 2)}`);

		const responses = _.defaults({}, answers, args, compositeConfig, system_defaults);
		// logger.debug(`🦠  responses: ${JSON.stringify(responses, null, 2)}`);

	
		// args.publisher = args.publisher || compositeConfig.publisher || responses.publisher;


		// if (!args.id) {
		// 	// In order for a name to be safe for both iOS and Android,
		// 	// it can't have anything other than alphanumeric characters.
		// 	const safePublisher = args.publisher.trim().toLowerCase().replace(/[^a-z0-9]+/g, ``);
		// 	const safeName = args.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, ``);
		// 	args.id = `${safePublisher}.${safeName}`;
		// }
		// args.id = args.id || `${_.snakeCase(args.publisher.trim()).toLowerCase()}.${_.snakeCase(args.name.trim()).toLowerCase()}`;
		// args.path = args.path || path.join(process.cwd(), args.name);

		// args.description = args.description || compositeConfig.description || `Another awesome Titanium app!`;
		// args.guid = args.guid || compositeConfig.guid;

		// if (args.guid === `empty-guid`) {
		// 	args.guid = `00000000-0000-0000-0000-000000000000`;
		// // } else if (args.guid === 'new-guid') {
		// } else if (_.isNil(args.guid)) {
		// 	const uuidv4 = require(`uuid/v4`);
		// 	args.guid = uuidv4();
		// }

		// args.copyright = args.copyright || compositeConfig.copyright || `Copyright (c) ${args.currentYear} ${args.publisher}`;
		// args.url = args.url || compositeConfig.url || ``;


		// args.author_name = flags.author_name || compositeConfig.author_name || args.publisher;
		// args.author_email = flags.author_email || compositeConfig.author_email || `nobody@nowhere.com`;
		// args.author_url = flags.author_url || compositeConfig.author_url || args.url;

		// args.github_username = flags.github_username || compositeConfig.github_username || `my-github-username`;

		// args.repo_type = args.repo_type || `git`;
		// args.repo_url = args.repo_url || `github:${args.github_username}/${args.name}`;


		// args.bugs_url = flags.bugs_url || compositeConfig.bugs_url || `https://github.com/${args.github_username}/${args.name}/issues`;
		// args.bugs_email = flags.bugs_email || compositeConfig.bugs_email || args.author_email;

		// args.license = flags.license  || compositeConfig.license || `MIT`;

		// dump(compositeConfig);
		// dump(this.config);
		// dump(args);

		// const debug = logger(`execute`);
		let titanium_directory;

		// debug(`args: ${JSON.stringify(args, null, 2)}`);
		debug(`__dirname: ${__dirname}`);
		debug(`process.cwd(): ${process.cwd()}`);

		const project_directory = responses[`path`];
		debug(`project_directory: ${project_directory}`);
		debug(`project_directory.exists: ${pathExists.sync(project_directory)}`);

		const getTempDirectory = () => {
			const temp_directory = temp.path({ prefix: `titanium` });
			fs.emptyDirSync(temp_directory);
			debug(`temp_directory: ${JSON.stringify(temp_directory, null, 2)}`);
			return Promise.resolve(temp_directory).disposer((directory, promise) => {
				fs.removeSync(directory);
			});
		};

		const configure_project_directory = () => {
			spinner.start(`Configuring project directory`);
			return fs.ensureDir(project_directory)
				.then(() => {
					spinner.info();
					spinner.note(project_directory, 1);
				});
		};

		const template_file = filename => {
			// const debug = logger(`template_file`);
			filename = path.join(project_directory, filename);
			// debug(`templating file: ${filename}`);
			spinner.start(filename, 2);
			return fs
				.readFile(filename)
				.then(source => fs.writeFile(filename, _.template(source)(responses)))
				.then(() => spinner.note());
		};

		const template_other_files = () => {
			// const debug = logger(`template_other_files`);
			spinner.info(`Templating other files`, 1);
			return Promise.mapSeries([ `tiapp.xml`, `package.json` ], template_file);
		};

		const findTiappXml = root => {
			// const debug = logger(`findTiappXml`);
			// eslint-disable-next-line promise/avoid-new
			return new Promise((resolve, reject) => {
				spinner.start(`Looking for Titanium project file`, 1);
				debug(`looking for tiapp.xml in: ${root}`);
				const finder = findit(root);
				finder.on(`file`, (file, stat) => {
					const filepath = path.parse(file);
					if (filepath.base === `tiapp.xml`) {
						spinner.succeed();
						resolve(filepath.dir);
						finder.stop();
					}
				});
				finder.on(`end`, () => {
					spinner.fail();
					spinner.fail(chalk.red(`Titanium project file not found`), 2);
					reject(`Titanium project file not found`);
				});
				finder.on(`error`, error => {
					spinner.fail();
					reject(error);
				});

			}).then(result => {
				titanium_directory = result;
				if (!titanium_directory) {
					spinner.fail(chalk.red(`Titanium project file not found`), 2);
					throw new Error(`Titanium project file not found`);
				}
				spinner.note(titanium_directory, 2);
			});
		};

		const configure_project_files = async () => {
			spinner.info(`Configuring project files`);
			return ensure_package_json()
				.then(() => spinner.start(`Finding template files`, 1))
				.then(() => globby([ `**/*-template.*`, `**/*.*-template` ], { cwd: responses.path, onlyFiles: true, deep: true, dot: true }))
			 	.then(files => {
					spinner.succeed();
					spinner.info(`Templating project files`, 1);
					return Promise.mapSeries(files, async file => {

						if (!file.includes(`node_modules`)) {
							const new_filename = file.replace(`-template`, ``);
							if (file.includes(`-template`)) {
								const new_filename = file.replace(`-template`, ``);
								await fs.copy(path.join(project_directory, file), path.join(project_directory, new_filename), {
									overwrite: true, filter:    (src, dest) => {
										return !src.includes(`node_modules`);
									},
								});

								await fs.remove(path.join(project_directory, file));
							}

							await template_file(new_filename);
						}
					});
				});
		};

		const copy_template = name => {
			// const debug = logger(`copy_template`);
			spinner.info(`Installing template`, 0);
			const source = path.resolve(name);
			debug(`source: ${source}`);
			spinner.start(`Checking for local template`, 1);
			return pathExists(source).then(exists => {
				debug(`pathExists.sync(source): ${exists}`);
				if (exists) {
					spinner.succeed();
					debug(`copying files to project root directory: ${project_directory}`);
					spinner.start(`Copying template to project root directory`, 1);
					return fs.copy(source, project_directory, {
						clobber: true,
						filter:  file => {
							return true;
						},
					}).then(() => {
						spinner.succeed();
						return true;
					});
				} else {
					spinner.skip();
					spinner.note(`Local template not found.`, 2);

					return using(getTempDirectory(), async temp_directory => {
						const nodeModulesDir = path.join(temp_directory, `node_modules`);
						debug(`installing remote template to: ${project_directory}`);
						spinner.start(`Installing remote template: ${chalk.gray(name)}`, 1);
						const { stdout, stderr } = await asyncExec(`npm install ${name} --ignore-scripts --global-style --no-optional --only=prod --no-audit --production`, { cwd: temp_directory });

						// return npm
						// 	.install([ name, `--ignore-scripts`, `--global-style`, `--no-optional`, `--only=prod`, `--no-audit`, `--production` ], {
						// 		cwd:    temp_directory,
						// 		silent: true,
						// 	})
						// .then(() => {
						// eslint-disable-next-line promise/avoid-new
						const template_source = await new Promise((resolve, reject) => {
							spinner.succeed();
							spinner.start(`Examining template`, 1);

							const finder = findit(nodeModulesDir);
							finder.on(`file`, (file, stat) => {
								const filepath = path.parse(file);
								if (_.includes([ `package.json`, `package-template.json` ], filepath.base)) {
									spinner.succeed();
									resolve(filepath.dir);
									finder.stop();
								}
							});
						});

						// .then(template_source => {
						debug(`copying files to project root directory: ${project_directory}`);
						spinner.start(`Copying template to project root directory`, 1);
						await fs.copy(template_source, project_directory, {
							clobber: true,
							filter:  file => {
								const filepath = file.substring(template_source.length);
								return multimatch(filepath, [ `*`, `!/package.json` ]);
							},
						});

						spinner.succeed();
						return true;
					});
				}
			});
		};

		const ensure_package_json = () => {
			debug(`ensuring that package.json exists in project root`);
			spinner.info(`Ensuring package.json exists in project root.`, 1);
			const packagePath = path.join(project_directory, `package.json`);
			return fs.pathExists(packagePath)
				.then(exists => {
					if (!exists) {
						spinner.warn(`package.json not found in project root.`);
						spinner.start(`creating default package.json in project root`, 2);
						const pkg = {
							name:        responses.id,
							version:     `0.0.1`,
							description: responses.description,
							main:        `index.js`,
							scripts:     [],
							keywords:    [],
							author:      responses.author,
							license:     responses.license,

						};

						return fs.outputJson(packagePath, pkg)
							.then(() => spinner.succeed());
					} else {
						spinner.note(`package.json found in project root directory`, 2);
					}
				});
		};

		await configure_project_directory();
		// .then(() => copy_template(args.template))
		// .then(() => findTiappXml(project_directory))
		// .then(() => configure_project_files())
		await copy_template(responses.template);
		await findTiappXml(project_directory);
		await configure_project_files();
		spinner.start(`Installing npm dependencies`, 1);
		const { stdout, stderr } = await asyncExec(`npm install`, { cwd: project_directory });
		spinner.succeed();

		// 	return npm
		// 		.install({
		// 			cwd:    project_directory,
		// 			silent: true,
		// 		})
		// 		.then(() => spinner.succeed());
		// })
		await template_other_files()
			.catch(err => {
				console.error(`Error occurred: ${err}`);
				console.error(err);
				spinner.fail(err);
			});

		process.on(`unhandledRejection`, (reason, promise) => {
			console.error(`Error occurred: ${reason}`);
			console.error(reason);
			spinner.fail(reason);
		});
	}
}

CreateCommand.description = `Create a shiny new mobile application
...
Create a new mobile app from a template using all sorts of nifty options!

Tool will create an app using values from parameters or from the user config file which is located here:  ~/.config/@geek/mobile/config.json
Future versions of the tool will allow setting config values from CLI.
`;
CreateCommand.topic = `app`;
CreateCommand.id = `create`;
CreateCommand.usagePrefix = `${`mobile ${CreateCommand.topic}:${CreateCommand.id}`.bold.yellow} my-app-name`;

// dump(flags);

CreateCommand.examples = `
${`Create app from template in npm package`.underline}

${CreateCommand.usagePrefix} [@scope/]<name>
${CreateCommand.usagePrefix} [@scope/]<name>@<tag>
${CreateCommand.usagePrefix} [@scope/]<name>@<version>
${CreateCommand.usagePrefix} [@scope/]<name>@<version range>

${`Create app from template in git repo`.underline}

${CreateCommand.usagePrefix} <git-host>:<git-user>/<repo-name>
${CreateCommand.usagePrefix} <git-host>:<git-user>/<repo-name>#<tag>
${CreateCommand.usagePrefix} <git-host>:<git-user>/<repo-name>#<branch>
${CreateCommand.usagePrefix} <git repo url>

${`(where <git-host> can be: github, bitbucket, or gitlab)`.italic}

${`Create app from template in tarball`.underline}

${CreateCommand.usagePrefix} <tarball file>
${CreateCommand.usagePrefix} <tarball url>

${`Create app from template in local directory`.underline}

${CreateCommand.usagePrefix} <folder>

`;


CreateCommand.args = [
	{
		name:        `name`,
		required:    false,
		description: `Name of your project`,
	},
	{
		name:        `template`,
		required:    false,
		description: `Template to use for creating your new app`,
	},
];

logger.debug(`🦠  compositeConfig: ${JSON.stringify(compositeConfig, null, 2)}`);

CreateCommand.flags = {
	template: flags.string({
		char:        `t`,
		description: `Template to use for creating your new app`,
		required:    false,
	}),
	id: flags.string({
		char:        `i`,
		description: `ID for your project`,
		required:    false,
	}),
	guid: flags.string({
		char:        `g`,
		description: `GUID for your project`,
		required:    false,
	}),
	name: flags.string({
		char:        `n`,
		description: `Name of your project`,
		required:    false,
	}),
	publisher: flags.string({
		char:        `p`,
		description: `Name of person/company publishing app`,
		required:    false,
		// required:    !compositeConfig.publisher,
	}),
	copyright: flags.string({
		char:        `c`,
		description: `Copyright for your project`,
		default:     ``,
		required:    false,
	}),
	description: flags.string({
		char:        `d`,
		description: `Description for your project`,
		// default:     `Another awesome Titanium Turbo mobile app!`,
		required:    false,
	}),
	url: flags.string({
		char:        `u`,
		description: `URL for your project`,
		// default:     `https://www.axway.com`,
		required:    false,
	}),
	path: flags.string({
		char:        `p`,
		description: `Specifies the directory where you want to initialize the project`,
		required:    false,
	}),
	license: flags.string({
		char:        `l`,
		description: `Specifies the license for the project`,
		default:     `MIT`,
		required:    false,
	}),
	github_username: flags.string({
		description: `Specifies the github username for the project`,
		// required:    !compositeConfig.github_username,
		required:    false,
	}),
	author_name: flags.string({
		description: `Specifies the full name of the Author`,
		// required:    !compositeConfig.author_name,
		required:    false,
	}),
	author_email: flags.string({
		description: `Specifies the email address of the Author`,
		// required:    !compositeConfig.author_email,
		required:    false,
	}),
	author_url: flags.string({
		description: `Specifies the URL for the Author`,
		// required:    !compositeConfig.author_url,
		required:    false,
	}),
	repo_url: flags.string({
		description: `Specifies the URL for the repo`,
		// required:    !compositeConfig.repo_url,
		required:    false,
	}),
	bugs_url: flags.string({
		description: `Specifies the URL for submitting issues/bugs`,
		// required:    !compositeConfig.bugs_url,
		required:    false,
	}),
	bugs_email: flags.string({
		description: `Email address for submitting issues/bugs`,
		// required:    !compositeConfig.bugs_email,
		required:    false,
	}),
};

CreateCommand.strict = false;

module.exports = CreateCommand;
