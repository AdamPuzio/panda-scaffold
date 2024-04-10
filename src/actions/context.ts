import path from 'path'

import { ScaffoldAction } from './action'

export class ScaffoldActionContext extends ScaffoldAction {
  name = 'context'
  description = 'Check context'

  factory

  async run(action, data, factory) {
    this.factory = factory
    if (!action.context) throw new Error('No context provided to check')
    switch (action.context) {
      case 'inProject':
        return await this.inProject(action.cwd)
      case 'inPandaProject':
        return await this.inPandaProject(action.cwd)
    }
  }

  async inPanda() {}

  async inProject(cwd) {
    const packageJson = await this.getPackageJson(cwd, 'return')
    if (packageJson === false)
      throw new Error('Needs to be run inside a project')
  }

  async inPandaProject(cwd) {
    const packageJson = await this.getPackageJson(cwd, 'return')
    if (packageJson === false || !packageJson.panda)
      throw new Error('Needs to be run inside a Panda project')
  }

  async getPackageJson(cwd, onError = 'throw') {
    const packageJson = path.join(cwd, 'package.json')
    const packageJsonExists = await this.factory.fileExists(packageJson)
    if (!packageJsonExists) {
      if (onError === 'return') return false
      throw new Error(`package.json doesn't exist at ${packageJson}`)
    }
    const json = await this.factory.readJsonFile(packageJson)
    return json
  }
}
