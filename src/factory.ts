import * as ChildProcess from 'child_process'
import path from 'path'
import * as fss from 'node:fs'
import * as fs from 'node:fs/promises'
import * as _ from 'lodash'
import { glob } from 'glob'
import Handlebars from 'handlebars'
import { isGlob } from './inc/is-glob'

const helpers = {
  kebabCase: v => _.kebabCase(v), // becomes-this
  dashCase: v => _.kebabCase(v), // becomes-this
  titleCase: v => _.startCase(v), // Becomes This
  camelCase: v => _.camelCase(v), // becomesThis
  pascalCase: v => _.upperFirst(_.camelCase(v)), // BecomesThis
  snakeCase: v => _.snakeCase(v), // becomes_this
  envCase: v => _.snakeCase(v).toUpperCase(), // BECOMES_THIS
  dotCase: v => _.replace(_.snakeCase(v), '_', '.'), // becomes.this
  pathCase: v => _.replace(_.snakeCase(v), '_', '/'), // becomes/this
  namespaceCase: v => _.replace(_.snakeCase(v), '_', ':'), // becomes/this
  sentenceCase: v => _.sentenceCase(v), // Becomes this
  lowerCase: v => _.lowerCase(v), // becomes this
  upperCase: v => _.upperCase(v), // BECOMES THIS
}
Object.keys(helpers).forEach(h => Handlebars.registerHelper(h, helpers[h]))

class PandaFactory {
  __clone: boolean = false

  _ = {}

  mod = helpers

  data = {}

  constructor(cfg?) {
    if (!cfg) return this

    this.__clone = true
    Object.entries(cfg).forEach(([key, value]) => {
      this[key] = value
    })
    return this
  }

  clone(cfg) {
    return new PandaFactory(cfg)
  }

  render(str:string, data={}) {
    const context = { ...this.data, ...data }
    return Handlebars.compile(str)(context)
  }

  path(dir:string, data?) {
    return this.render(dir, data)
  }

  ensurePath(dir) {
    return fss.mkdirSync(dir, { recursive: true })
  }

  async fileExists(file) {
    try {
      await fs.stat(file)
      return true
    } catch (err) {
      return false
    }
  }

  async list(dir, opts = {}) {
    return glob.sync(path.join(dir, '**/*'), opts)
  }

  async readFile(file) {
    return await fs.readFile(file, { encoding: 'utf8' })
  }

  /**
   * Write contents to a file
   *
   * @param file                file to write to
   * @param output              contents to write to file
   * @param opts
   * @param opts.force          flag to forcefully write to the file even if the file already exists
   * @param opts.skipIfExists   flag to skip the file if it exists
   * @param opts.encoding       encoding of file
   * @returns
   */
  async writeFile(file, output, opts?) {
    const {
      force = false,
      skipIfExists = false,
      encoding = 'utf8',
    } = opts || {}
    const exists = await this.fileExists(file)
    if (exists && skipIfExists) return
    if (exists && force !== true) throw new Error(`${file} already exists`)
    return await fs.writeFile(file, output, { encoding })
  }

  async readJsonFile(file) {
    const contents = await this.readFile(file)
    return JSON.parse(contents)
  }

  async writeJsonFile(file, json) {
    const output = JSON.stringify(json)
    return await this.writeFile(file, output)
  }

  isGlob = (str) => isGlob(str)
  isDir = (dir) => {
    const lstat = fss.lstatSync(dir, { throwIfNoEntry: false })
    return lstat && lstat.isDirectory()
  }
  isFile = (file) => {
    const lstat = fss.lstatSync(file, { throwIfNoEntry: false })
    return lstat && lstat.isFile()
  }

  openBrowser(url) {
    ChildProcess.exec(
      process.platform.replace('darwin', '').replace(/win32|linux/, 'xdg-') +
        'open ' +
        url,
    )
  }

  /**
   * Runs a command
   *
   * @param {String} cmd              command to run
   * @param {Object} opts             options
   * @param {boolean} opts.stream     stream output
   * @returns
   */
  async runCommand(cmd, { stream = false } = {}) {

    const stdio = stream ? 'inherit' : 'pipe'
    try {
      const response: Buffer = ChildProcess.execSync(cmd, { stdio })
      if (response !== null && typeof response.toString === 'function')
        return response.toString().trim()
    } catch (err) {
      return err
    }
  }
}

export const Factory = new PandaFactory()
