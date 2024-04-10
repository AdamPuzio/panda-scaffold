import { ScaffoldAction } from './action'

export class ScaffoldActionModify extends ScaffoldAction {
  name = 'modify'

  async run(action, data, factory) {
    const { target, pattern, template, transform } = action

    // validate target exists and fail if it doesn't
    const exists = await factory.fileExists(target)
    if (!exists) throw new Error(`${target} doesn't exist`)

    // fetch the contents of the target file
    let contents = await factory.readFile(target)

    // replace pattern in content with template
    if (pattern && template) {
      const tpl = factory.render(template)
      if (typeof pattern === 'string' || pattern instanceof RegExp)
        contents = contents.replace(pattern, tpl)
    }

    // run transform()
    if (typeof transform === 'function') {
      contents = transform(contents, data, factory)
      if (contents instanceof Promise) contents = await contents
    }
    await factory.writeFile(target, contents, { force: true })
  }
}
