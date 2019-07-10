# Geek Mobile Toolkit
=========
> Everything a geek needs to create, build, and manage cross-platform native mobile apps.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@geek/mobile.svg)](https://npmjs.org/package/@geek/mobile)
[![Downloads/week](https://img.shields.io/npm/dw/@geek/mobile.svg)](https://npmjs.org/package/@geek/mobile)
[![License](https://img.shields.io/npm/l/@geek/mobile.svg)](https://github.com/brentonhouse/geek-mobile/blob/master/package.json)


# Usage
<!-- usage -->
```sh-session
$ npm install -g @geek/mobile
$ mobile COMMAND
running command...
$ mobile (-v|--version|version)
@geek/mobile/0.0.10 darwin-x64 node-v10.16.0
$ mobile --help [COMMAND]
USAGE
  $ mobile COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`mobile app:create [NAME] [TEMPLATE]`](#mobile-appcreate-name-template)
* [`mobile help [COMMAND]`](#mobile-help-command)
* [`mobile which COMMAND`](#mobile-which-command)

## `mobile app:create [NAME] [TEMPLATE]`

Create a shiny new mobile application

```
USAGE
  $ mobile app:create [NAME] [TEMPLATE]

ARGUMENTS
  NAME      Name of your project
  TEMPLATE  Template to use for creating your new app

OPTIONS
  -c, --copyright=copyright              Copyright for your project
  -d, --description=description          Description for your project
  -i, --id=id                            [default: Generate from project name] ID for your project
  -l, --author_email=author_email        [default: nobody@nowhere.com] Specifies the email address of the Author
  -l, --author_name=author_name          Specifies the full name of the Author
  -l, --author_url=author_url            Specifies the URL for the Author
  -l, --github_username=github_username  [default: my-github-username] Specifies the github username for the project
  -l, --license=license                  [default: MIT] Specifies the license for the project
  -n, --name=name                        Name of your project
  -p, --path=path                        Specifies the directory where you want to initialize the project
  -p, --publisher=publisher              Name of person/company publishing app

  -t, --template=template                [default: @titanium/template-alloy-default] Template to use for creating your
                                         new app

  -u, --url=url                          URL for your project

DESCRIPTION
  ...
  Create a new mobile app from a template using all sorts of nifty options!

  Tool will create an app using values from parameters or from the user config file which is located here:  
  ~/.config/@geek/mobile/config.json
  Future versions of the tool will allow setting config values from CLI.

EXAMPLES

  Create app from template in npm package

  mobile app:create my-app-name [@scope/]<name>
  mobile app:create my-app-name [@scope/]<name>@<tag>
  mobile app:create my-app-name [@scope/]<name>@<version>
  mobile app:create my-app-name [@scope/]<name>@<version range>

  Create app from template in git repo

  mobile app:create my-app-name <git-host>:<git-user>/<repo-name>
  mobile app:create my-app-name <git-host>:<git-user>/<repo-name>#<tag>
  mobile app:create my-app-name <git-host>:<git-user>/<repo-name>#<branch>
  mobile app:create my-app-name <git repo url>

  (where <git-host> can be: github, bitbucket, or gitlab)

  Create app from template in tarball

  mobile app:create my-app-name <tarball file>
  mobile app:create my-app-name <tarball url>

  Create app from template in local directory

  mobile app:create my-app-name <folder>
```

_See code: [oclif-plugin-titanium](https://github.com/brentonhouse/oclif-plugin-titanium/blob/v0.0.9/src/commands/app/create.js)_

## `mobile help [COMMAND]`

display help for mobile

```
USAGE
  $ mobile help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `mobile which COMMAND`

show which plugin a command is in

```
USAGE
  $ mobile which COMMAND
```

_See code: [@oclif/plugin-which](https://github.com/oclif/plugin-which/blob/v1.0.3/src/commands/which.ts)_
<!-- commandsstop -->

# Roadmap

- [x] **app:create -** Create a new mobile app project from templates
- [ ] **app:build -** Build iOS/Android mobile apps
- [ ] **app:run -** Run mobile app on simulator or device
- [ ] **app:clean -** Clean up build artifacts from project
- [ ] **resource:icons -** Manage iOS/Android icons for app
- [ ] **resource:images -** Manage images for mobile project
- [ ] **resource:splashes -** Manage images for mobile project
- [ ] **config:user -** Get/Set properties in user config file
- [ ] **config:project -** Get/Set properties in project config file
- [ ] **alias:create -** Create an alias for executing multiple commands with optional parameters
- [ ] Optional prompting for parameters
- [ ] User configuration file
- [ ] Project configuration file
