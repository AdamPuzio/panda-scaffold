import path from 'path'

import { ScaffoldAction } from './action'

export class ScaffoldActionAddMany extends ScaffoldAction {
  name = 'add-many'
  description = 'Add many files'

  startMessage = 'Add files'

  async run(action, data, factory) {
    const { force = false, skipIfExists = false } = data
    // See add.ts for why this translates to a single `ifExists` policy.
    const ifExists = skipIfExists ? 'skip' : force ? 'overwrite' : 'throw'

    // ensure the base target path exists
    factory.ensurePath(path.dirname(action.target))

    // get a list of the files located at source
    const files = await factory.list(action.source, { nodir: true, stat: true })

    for (const file of files) {
      const fileRel = file.replace(action.source, '')
      const targetPath = factory.path(path.join(action.target, fileRel))
      factory.ensurePath(path.dirname(targetPath))
      const contents = await factory.readFile(file)
      const output = factory.render(contents)
      await factory.writeFile(targetPath, output, { ifExists })
    }
  }
}
