import path from 'path'

import { ScaffoldAction } from './action'

export class ScaffoldActionAdd extends ScaffoldAction {
  name: string = 'add'

  async run(action, data, factory) {
    const { force = false, skipIfExists = false } = data
    // @panda/factory's writeFile uses a single `ifExists` policy, not
    // separate force/skipIfExists booleans — see DECISIONS.md's Factory
    // reconciliation entry. skipIfExists wins if both are somehow set,
    // matching this file's own original precedence.
    const ifExists = skipIfExists ? 'skip' : force ? 'overwrite' : 'throw'
    factory.ensurePath(path.dirname(action.target))
    const contents = await factory.readFile(action.source)
    const output = factory.render(contents)
    await factory.writeFile(action.target, output, { ifExists })
  }
}
