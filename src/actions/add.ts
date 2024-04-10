import path from 'path'

import { ScaffoldAction } from './action'

export class ScaffoldActionAdd extends ScaffoldAction {
  name: string = 'add'

  async run(action, data, factory) {
    const { force = false, skipIfExists = false } = data
    factory.ensurePath(path.dirname(action.target))
    const contents = await factory.readFile(action.source)
    const output = factory.render(contents)
    await factory.writeFile(action.target, output, { force, skipIfExists })
  }
}
