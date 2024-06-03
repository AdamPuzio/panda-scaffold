import path from 'path'

import { ScaffoldAction } from './action'

export class FileCopyScaffoldAction extends ScaffoldAction {
  static name = 'file:copy'
  static description: string = 'Copy a file'

  startMessage?: string = 'Copying files'
  successMessage?: string = 'Copied files'
  errorMessage?: string = 'Failed to copy files'

  async run({
    source,
    target,
    options = {}
  }: {
    source: string
    target: string
    options: {
      overwrite?: boolean,
      filter?: (source: string, target: string) => boolean
    }
  }) {
    if (!source) throw new Error('No source provided to copy file')
    if (!target) throw new Error('No target provided to copy file')

    const filter = options.filter || (() => true)

    if (this.factory.isGlob(source)) {
      // glob - get a list of the files located at source
      const files = await this.factory.list(source, { nodir: true, stat: true })
      for (const file of files) {
        const fileRel = file.replace(source, '')
        const targetPath = this.factory.path(path.join(target, fileRel))
        if (!filter(file, targetPath)) continue
        this.factory.ensurePath(path.dirname(targetPath))
        const contents = await this.factory.readFile(file)
        const output = this.factory.render(contents)
        await this.factory.writeFile(targetPath, output, { force: options.overwrite })
      }
    } else if (this.factory.isDir(source)) {
      // dir - copy all files in the directory
      const files = await this.factory.list(source, { nodir: true, stat: true })
      for (const file of files) {
        const fileRel = file.replace(source, '')
        const targetPath = this.factory.path(path.join(target, fileRel))
        if (!filter(file, targetPath)) continue
        this.factory.ensurePath(path.dirname(targetPath))
        const contents = await this.factory.readFile(file)
        const output = this.factory.render(contents)
        await this.factory.writeFile(targetPath, output, { force: options.overwrite })
      }
    } else {
      // file - copy the file
      if (!filter(source, target)) return
      this.factory.ensurePath(path.dirname(target))
      const contents = await this.factory.readFile(source)
      const output = this.factory.render(contents)
      await this.factory.writeFile(target, output, { force: options.overwrite })
    }
  }
}
