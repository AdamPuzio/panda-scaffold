# Scaffold

`@panda/scaffold` is a class for creating easy-to-use Scaffolds.

It is part of the [Panda](https://github.com/AdamPuzio/panda) entity catalog, but can be used on its own as an independent class. It extends [`@panda/command`](https://github.com/AdamPuzio/panda-command), so any additional documentation necessary can be found there.

## Installation

To install just the Command class, run the following:

```bash
npm i @panda/scaffold
```

## Usage

Import or require the library:

```js
// ESM
import { Scaffold } from '@panda/scaffold'

// CommonJS
const { Command } = require('@panda/scaffold')
```

Now you're ready to create a Scaffold:

```js
const MyCommand = new Command({
  name: 'foo:create',

  scaffoldDir: path.join(__dirname, '..', 'scaffolds'),

  actions: [{
    type: 'addMany',
    source: 'foo', // this will be appended to scaffoldDir
    target: '{{ kebabCase name }}' // this will be appended to cwd
  }]
}).parse()
```

### Properties

| Key               | Type         | Req | Description |
| ----------------- | ------------ | --- | ----------- |
| name              | string       | Y   | Name |
| command           | string       | N   | Command (used to enable subcommands) |
| title             | string       | N   | Title |
| description       | string       | N   | Description to be used in help |
| arguments         | object       | N   | Argument parsing definition |
| options           | array        | N   | List of options to be parsed |
| help              | string       | N   | Text to output in `--help` |
| additionalHelp    | string       | N   | Additional text to output in `--help` |
| hidden            | boolean      | N   | Hides the command from `--help` if `true` |
| version           | string       | N   | Semver version of the command |
| subcommands       | array        | N   | List of subcommands to be parsed |
| prompts           | array        | N   | List of prompts to run |
| promptTypes       | object       | N   | Key/value list of prompt types available to `prompts` |
| transform         | function     | N   | Method to transform response data from prompts |
| action            | function     | N   | Action method to run when command is called |
| actions           | array        | N   | List of actions to perform |
| actionTypes       | object       | N   | List of actionTypes |

## Actions

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
