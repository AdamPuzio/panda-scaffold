import path from 'path'

import { ScaffoldAction } from './action'

export class JsonCreateScaffoldAction extends ScaffoldAction {
  static name = 'json:create'
  static description = 'Create a JSON file'

  startMessage?: string = 'Creating JSON file: {{target}}'
  successMessage?: string = 'Created JSON file: {{target}}'
  errorMessage?: string = 'Failed to create JSON file: {{target}}'

  async run({
    target,
    data = {},
    options = {
      force: false,
      spaces: 2,
    },
  }: {
    target: string
    data: { [key: string]: any }
    options: { force?: boolean, spaces?: number }
  }) {
    if (!target) throw new Error('No target provided to create JSON file')
    if (!data) throw new Error('No data provided to create JSON file')

    // ensure the base target path exists
    this.factory.ensurePath(path.dirname(target))
    let output = JSON.stringify(data, null, options.spaces)
    output = this.factory.render(output)
    await this.factory.writeFile(target, output, { force: options.force })
  }
}
