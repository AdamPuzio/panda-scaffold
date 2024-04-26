# Scaffold

`@panda/scaffold` is a library for creating easy-to-use scaffolds.

It is part of the [Panda](https://github.com/AdamPuzio/panda) entity catalog, but can be used on its own as an independent class. It extends [`@panda/command`](https://github.com/AdamPuzio/panda-command), so any additional documentation necessary can be found there.

## Installation

To install the Scaffold class into an existing project, run the following:

```bash
npm i @panda/scaffold
```

## Usage

Import or require the library:

```js
// ESM
import { Scaffold } from '@panda/scaffold'

// CommonJS
const { Scaffold } = require('@panda/scaffold')
```

Now you're ready to create a Scaffold:

```js
const MyCommand = new Scaffold({
  name: 'foo:create',

  scaffoldDir: path.join(__dirname, '..', 'scaffolds'),

  actions: [{
    type: 'addMany',
    source: 'foo', // this will be appended to scaffoldDir
    target: '{{ kebabCase name }}' // this will be appended to cwd
  }]
}).parse()
```

## Configuration

| Property                        | Type         | Req | Description |
| ------------------------------- | ------------ | --- | ----------- |
| [`name`](#name)                 | string       | Y   | Command name |
| [`command`](#command)           | string       | N   | Terminal command to be called (used to enable subcommands) |
| [`scaffoldDir`](#scaffolddir)   | string       | N   | Directory of local scaffolds |
| [`arguments`](#arguments)       | object       | N   | Argument parsing definition |
| [`options`](#options)           | array        | N   | List of options to be parsed |
| [`subcommands`](#subcommands)   | array,object | N   | List of subcommands to be parsed |
| [`prompts`](#prompts)           | array        | N   | List of prompts to run |
| [`promptTypes`](#prompttypes)   | object       | N   | List of prompt types available to `prompts` |
| [`transform`](#transform)       | function     | N   | Method to transform response data from prompts |
| [`action`](#action)             | function     | N   | Action method to run when command is called |
| [`actions`](#actions)           | array        | N   | List of actions to perform |
| [`actionTypes`](#actiontypes)   | object       | N   | List of additional action types available to `actions` |


### `name`

(required) The identifying property of the Scaffold.

### `command`

Provides the default command to be called when imported, usually as a subcommand.

If not explicitly set, it defaults to `name`.

### `scaffoldDir`

The default directory where your scaffolds are located. This will automatically be prepended to any `source` action params.

### `arguments`

The `arguments` property allows you to add a catch-all for any arguments passed.

It is a single object that works similar to [`options`](#options), so arguments can be passed in either directly or via parameter. 

| Key           | Type         | Req | Description |
| ------------- | ------------ | --- | ----------- |
| name          | string       | Y   | Argument name |
| type          | function     | N   | Argument type (`String`, `Number`, `Boolean`) or a function (default: `String`) |
| alias         | string       | N   | getopt-style short option name (single character) |
| multiple      | boolean      | N   | Flag for declaring the possibility of multiple values (default: `false`) |
| lazyMultiple  | boolean      | N   | Identical to `multiple` but with greedy parsing disabled (default: `false`) |
| defaultValue  | any          | N   | Default value used when no value is passed |
| group         | string,array | N   | Category name(s) to group by |
| validate      | function     | N   | Function to validate passed value against |

```js
const MyScaffold = new Scaffold({
  command: 'my-scaffold',
  arguments: {
    name: 'value',
    type: String,
    multiple: true,
  },
  action: async (data, details) => {
    console.log(data.value)
  }
})
```

```bash
$ my-scaffold foo bar
['foo', 'bar']
```

Notes:

- NO `arguments` property can be passed if using `subcommands`. If both are used, it will throw an error.
- In addition to any group(s) applied via `group`, all arguments will have the `args` group applied.
- Arguments can also be passed in like options using `name` or `alias`.

### `options`

The `options` property provides a list of any options that can be passed in, along with how to process them.

| Key           | Type         | Req | Description |
| ------------- | ------------ | --- | ----------- |
| name          | string       | Y   | Option name |
| type          | function     | N   | Option type as (`String`, `Number`, `Boolean`) or a function (default: `String`) |
| alias         | string       | N   | getopt-style short option name (single character) |
| multiple      | boolean      | N   | Flag for declaring the possibility of multiple values (default: `false`) |
| lazyMultiple  | boolean      | N   | Identical to `multiple` but with greedy parsing disabled (default: `false`) |
| defaultOption | boolean      | N   | Flag to identify where unaccounted values go (default: `false`) |
| defaultValue  | any          | N   | Initial option value |
| group         | string|array | N   | Category name to group by |
| validate      | function     | N   | Function to validate passed value against |


More details on option definitions can be found [here](https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md)

```js
const MyScaffold = new Scaffold({
  name: 'my-command',
  options: [
    {
      name: 'file',
      type: String,
      alias: 'f',
      multiple: true,
    },
    {
      name: 'name',
      type: String
    },
    {
      name: 'force',
      type: Boolean,
      alias: 'F',
      defaultValue: false
    }
  ],
  action: async (data, details) => {
    console.log(data)
  }
})
```

```bash
# single file passed
$ my-scaffold --file src/file.txt
{ file: ['src/file.txt'], force: false }

# multiple files passed
$ my-scaffold --file src/file.txt src/alt.txt
{ file: ['src/file', 'src/alt.txt'], force: false }

# `force` alias & name
$ my-scaffold -F -name 'Hello World'
{ name: 'Hello World', force: true }
```

Notes:

- In addition to any group(s) applied via `group`, all options will have the `opts` group applied.

### `subcommands`

The `subcommands` property accepts a list of other Scaffolds or Commands to be run as subcommands of the current Scaffold.

Subcommands can be added in as either an array or an object.

- When added as an **array**, it will use each subcommand's `command` property as the subcommand to use.
- When added as an **object**, the key will represent the subcommand.

This provides for greater flexibility in importing commands from different places.

```js
import { Command } from '@panda/command'
import { Scaffold } from '@panda/scaffold'

const CreateCommand = new Scaffold({
  name: 'create',
  action: () => {
    console.log('Hello!')
  }
})

export const ExampleCommand = new Command({
  name: 'example',

  subcommands: [
    CreateCommand
  ]
}).parse()

export default ExampleCommand
```

```bash
$ example create
Hello!
```

Notes:

- NO `arguments` property can be passed if using `subcommands`. If both are used, it will throw an error.

### `prompts`

List of questions to prompt the user with.

| Key           | Type         | Req | Description |
| ------------- | ------------ | --- | ----------- |
| name          | string                               | Y   | The name to apply in data |
| type          | string                               | N   | Type of the prompt (possible values: `input`, `number`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor` or custom type) (default: `input`) |
| message       | string,function                      | N   | The question to display (if defined as a function, the first parameter will be the current session answers) (default: `${name}:`) |
| default       | string,number,boolean,array,function | N    | Default value(s) to use if nothing is entered, or a function that returns the default value(s) (if defined as a function, the first parameter will be the current session answers) |
| choices       | array,function                       | N    | Choices array or a function returning a choices array (if defined as a function, the first parameter will be the current session answers; array values can be simple numbers, strings, or objects containing a name (to display in list), a value (to save in the answers hash), and a short (to display after selection) properties) |
| validate      | function                             | N    | Validation function - receives the user input and answers hash (return true if the value is valid, or an error message (String) or false (default error message) otherwise) |
| filter        | function                             | N    | Filtering function - receives the user input and answers hash (return the new filtered value) |
| transformer   | function                             | N    | Transformer function - receives the user input, answers hash and option flags, and return a transformed value to display to the user (the transformation only impacts what is shown while editing, it does not modify the answers hash) |
| when          | function,boolean                     | N    | When-to-display function - receives the current user answers hash and should return true or false depending on whether or not this question should be asked |
| askAnswered   | boolean                              | N    | Force to prompt the question if the answer already exists |

Both `arguments` and `options` can be used to allow the end user to bypass specific prompts by providing a value in the command. The `name` property must match between the `options` or `arguments` and the `prompts` item.

Additionally, the [`promptTypes`](#prompttypes) property is used to add in custom prompt types and the [`transform`](#transform) property is used to update values before it sent to `action`.

More details on prompt types and how they work can be found in the [Inquirer library](https://www.npmjs.com/package/inquirer#objects).

```js
const MyCommand = new Scaffold({
  name: 'my-scaffold',
  options: [
    {
      name: 'linter',
      alias: 'l',
      type: String,
    }
  ],
  prompts: [
    // this prompt will always display
    {
      name: 'name',
      message: 'Name',
    },
    // this prompt will only display if `--linter` or `-l` is not passed
    {
      name: 'linter',
      type: 'list',
      message: 'Select a linter',
      choices: ['ESLint', 'JSLint', 'JSHint', 'StandardJS'],
      default: 'StandardJS',
      validate: async function(response) {
        if (['ESLint', 'JSLint', 'JSHint', 'StandardJS'].includes(response)) return true
        return false
      }
    }
  ]
})
```

Notes:
- Arguments and options used to provide a value for a prompt WILL NOT trigger the prompt validation if a value is passed, so option validation is recommended, especially in the case of a list
- If the prompt `name` contains periods, it will define a path in the data object.

### `promptTypes`

List of prompt plugins that can be used in `prompts.type`.

Prompt types can be created manually or by including existing implementations. The `inquirer` library has a list of existing plugins that can be used here.

Additional Resources:

- [List of community create prompt types](https://github.com/SBoudrias/Inquirer.js#community-prompts)
- [Documentation on creating custom prompt types](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/core)

### `transform`

Transformation method to update `data` before it is sent to `action()`.

The lone parameter is `data`, which is an object containing all processed values. Return the updated data to be sent to `action()` as the `data` parameter.

```js
const MyScaffold = new Scaffold({
  name: 'my-scaffold',
  options: [
    {
      name: 'linter',
      alias: 'l',
      type: String,
    }
  ],
  prompts: [
    {
      name: 'linter',
      type: 'list',
      message: 'Select a linter',
      choices: ['ESLint', 'JSLint', 'JSHint', 'StandardJS'],
      default: 'StandardJS',
      validate: async function(response) {
        if (['ESLint', 'JSLint', 'JSHint', 'StandardJS'].includes(response)) return true
        return false
      }
    }
  ],
  transform: async (data) => {
    data._foo = 'bar'
    return data
  }
})
```

### `action`

Method providing all data and information processed.

There are 2 variables passed:
- `data` - the final data object
- `details` - an object with a full list of properties parsed:
  - `details.args` - data output for just `arguments`
  - `details.opts` - data output for just `options`
  - `details.unknown` - array of unknown parsed args
  - `details.tags` - object of data parsed by specific tags
  - `details.data` - output of full data

Notes:

- `action` is run before `actions` and, if not overriden, will output a title and run `actions`
- If both `action` and `actions` are provided, `action` must run `await this.runActions(data)` to properly run `actions`

### `actions`

A list of actions to perform using the processed data.

This should be an array of objects, each of which contain a corresponding action `type` and other potential configuration details.

See the [Default Actions](#default-actions) section for a list of the out-of-the-box actions available, as well as their configuration properties.

Example:

```js
import { Scaffold } from '@panda/scaffold'

export const EntityCreateScaffold = new Scaffold({
  name: 'foo:create',

  scaffoldDir: path.join(__dirname, '../scaffolds'),

  arguments: {
    name: 'name'
  },

  actions: [{
    type: 'context',
    context: 'inProject'
  }, {
    type: 'add',
    source: 'entity/foo/index.js',
    target: '{{ name }}/index.js'
  }, {
    type: 'modify',
    target: 'package.json',
    transform: async (contents, data, factory) {
      let json = JSON.parse(contents)
      json[data.name] = {}
      return JSON.stringify(json)
    }
  }]
})
```

### `actionTypes`

A list of additional action types that can be used in `actions.type`.

This should be an object hash with the key being the `type` called in `actions` and the value being the custom action class.

## Additional Properties

Scaffolds contain additional configuration properties inherited from `@panda/command`:

| Property                        | Type         | Req | Description |
| ------------------------------- | ------------ | --- | ----------- |
| [`description`](#description)   | string       | N   | Description to be used in help |
| [`version`](#version)           | string       | N   | Semver version of the scaffold/command |
| [`autoHelp`](#autohelp)         | boolean      | N   | Toggles automatic trigger of `--help` option |
| [`helpTitle`](#helptitle)       | string       | N   | Title to use in `--help` |
| [`helpText`](#helpText)         | string       | N   | Text to output in `--help` |
| [`addedHelp`](#addedhelp)       | string       | N   | Additional text to output in `--help` |
| [`hidden`](#hidden)             | boolean      | N   | Hides the command from `--help` if `true` |


### `description`

Description of Scaffold functionality.

This property displays in the `--help` option, both on the Scaffold's help page itself, as well as on the subcommand section of its parent Command.

### `version`

The [semver](https://semver.org/) version of the Scaffold.

### `autoHelp`

Flag to toggle auto-generation of the `--help` option flag. Set to `true` by default.

If set to `false`, you can still add your own help option, but it will require a call to the `renderHelp()` method to output.

### `helpTitle`

A title to output in the `--help` menu. Defaults to `Command: ${command}`.

### `helpText`

Text to output in the `--help` menu instead of dynamically generating it.

### `addedHelp`

Text to append to the `--help` menu.

Use this if you want to auto-generate the help text, but you want to add additional information, such as examples.

### `hidden`

Flag to hide the current Command from displaying in `--help` menus of parent Command(s).


## Default Actions

`@panda/scaffold` contains a number of included actions that can be used out-of-the-box:

* [`add`](#add)
* [`addMany`](#addmany)
* [`modify`](#modify)
* [`context`](#context)
* [`custom`](#custom)

Universal Action Props:

| Key               | Type         | Req | Description |
| ----------------- | ------------ | --- | ----------- |
| type              | string       | Y   | The action type to use |
| sourceBase        | string       | N   | Action override for `scaffoldDir` |
| targetBase        | string       | N   | Action override for `cwd` |
| source            | string       | N   | Relative source path |
| target            | string       | N   | Relative target path |
| startMessage      | string       | N   | Message to display on action start |
| successMessage    | string       | N   | Message to display on action success |
| errorMessage      | string       | N   | Message to display on action failure |

These properties can be used on any action.

### add

Adds a single file from `source` to `target`.

Example:

```js
actions: [
  {
    type: 'add',
    source: 'default/index.js',
    target: 'src/{{ kebabCase name }}/index.js'
  }
]
```

### addMany

Adds multiple files from `source` to `target`.

Example:

```js
actions: [
  {
    type: 'addMany',
    source: 'default',
    target: 'src'
  }
]
```

### modify

Modify the `target` file by replacing `pattern` with `template` or by running the `transform` method (or both).

Example:

```js
actions: [
  {
    type: 'modify',
    target: 'src/{{ kebabCase name }}/index.js',
    pattern: '--replace this--',
    template: '--with this--'
  },
  {
    type: 'modify',
    target: 'src/index.js',
    transform: async (contents, data, factory) {
      // ... do stuff to contents
      return contents
    }
  }
]
```

### context

Validate `cwd` is in a particular context.

Available contexts:
- `inProject` - in a project that contains a `package.json`
- `inPandaProject` - in a Panda project

Example:

```js
actions: [
  {
    type: 'context',
    context: 'inProject'
  }
]
```

### custom

Custom action that does whatever you'd like it to do.

Example:

```js
actions: [
  {
    type: 'custom',
    run: async (action, data, factory) {
      if (somethingBad) throw new Error('Failed custom action')
      return 'Successfully achieved greatness'
    }
  }
]
```

## Creating Custom Actions

Custom actions are created by extending the `ScaffoldAction` class. Be sure you're exporting/importing the uninstantiated class.

The `run()` method is used to parse the provided data for that instance of an action:
* `action` - a hash containing the configuration information passed in via `actions`
* `data` - the processed data object hash
* `factory` - an instance of `Factory` configured for that specific action 

```js
import { ScaffoldAction } from '@panda/scaffold'

export class MyScaffoldAction extends ScaffoldAction {
  name = 'myAction'
  description = 'Custom action'

  async run(action, data, factory) {
    // do your thing
  }
}
```

## Examples

```js
import { Scaffold } from '@panda/scaffold'

export const EntityCreateScaffold = new Scaffold({
  name: 'foo:create',

  scaffoldDir: path.join(__dirname, '../scaffolds'),

  arguments: {
    name: 'name'
  },

  options: [{
    name: 'lib',
    type: String
  }, {
    name: 'force',
    alias: 'f',
    type: Boolean
  }],

  prompts: [{
    type: 'input',
    name: 'name',
    message: 'Entity name'
  }, {
    type: 'input',
    name: 'lib',
    message: 'Library name'
  }],

  actions: [{
    type: 'context',
    context: 'inProject'
  }, {
    type: 'add',
    source: 'entity/foo/index.js',
    target: '{{ name }}/index.js'
  }, {
    type: 'modify',
    target: 'package.json',
    transform: async (contents, data, factory) {
      let json = JSON.parse(contents)
      json[lib] = data.lib
      return JSON.stringify(json)
    }
  }]
})
```

```bash
# run it with prompts
node ./foo.js
# run it with passed name param
node ./foo.js bar
# run it with all params provided
node ./foo.js bar -f --lib panda
```

## Factory

`Factory` is a custom class that provides convenience functionality to Scaffolds and actions. 

* `render(str, data)` - renders a template string (`str`) with processed data (`data`)
* `path(dir, data)` - similar to `render()`, but for paths
* `ensurePath(dir)` - creates any missing directories and files in the `dir` path
* `fileExists(file)` - returns `true` if `file` exists, `false` otherwise
* `list(dir, opts)` - provides a list of files that exist under the `dir`
* `readFile(file)` - returns the contents of `file`
* `writeFile(file, output, opts)` - writes `output` to `file`, with `force`, `skipIfExists` and `encoding` as options in `opts`
* `readJsonFile(file)` - returns the contents of JSON `file` as an object
* `writeJsonFile(file, json)` - writes `json` (objects) to `file`
* `openBrowser(url)` - opens a user's browser to the provided `url`
* `runCommand(cmd, opts)` - runs a command (`cmd`) in the terminal 

## Scripts

### Build

- **build** `npm run build` - Build from `./src` to `./dist` for ESM & CommonJS (with types)
- **build:cjs** `npm run build:cjs` - Build from `./src` to `./dist` for CommonJS (with types)
- **build:esm** `npm run build:esm` - Build from `./src` to `./dist` for ESM (with types)
- **watch** `npm run watch` - Watch `./src` directory and build on file change to `./dist` for ESM & CommonJS (with types)

### Lint

- **lint** `npm run lint` - Lint all files in `./src`
- **lint:fix** `npm run lint:fix` - Lint and fix all files in `./src`
- **lint:prettier** `npm run lint:prettier` - Fix styling for all files in `./src`
- **lint:prettier:ci** `npm run lint:prettier:ci` - CI style check

## Roadmap

- Create additional actions:
  - `createPackageJson`
  - `updatePackageJson`
  - `npmInstall`
  - `addDependency`
  - `removeDependency`
