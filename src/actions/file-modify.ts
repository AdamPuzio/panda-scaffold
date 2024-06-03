import { ScaffoldAction } from './action'

export class FileModifyScaffoldAction extends ScaffoldAction {
  static name = 'file:modify'
  static description = 'Modify file contents'

  async run({
    target,
    pattern,
    replace,
    transform
  }: {
    target: string
    pattern?: string | RegExp
    replace?: string
    transform?: (contents: string, data: any) => Promise<string> | string
  }) {
    // validate target exists and fail if it doesn't
    const exists = await this.factory.fileExists(target)
    if (!exists) throw new Error(`${target} doesn't exist`)

    // fetch the contents of the target file
    let contents = await this.factory.readFile(target)

    // replace pattern in content with template
    if (pattern && replace) {
      const tpl = this.factory.render(replace)
      if (typeof pattern === 'string' || pattern instanceof RegExp)
        contents = contents.replace(pattern, tpl)
    }

    // run transform()
    if (typeof transform === 'function') {
      const result = transform(contents, this.data)
      contents = result instanceof Promise ? await result : result
    }
    await this.factory.writeFile(target, contents, { force: true })
  }
}
