import path from 'path'

import { ScaffoldAction } from './action'

export class ContextScaffoldAction extends ScaffoldAction {
  static name = 'context'
  static description = 'Check context'

  startMessage?: string = 'Checking context: {{context}}'
  successMessage?: string = 'Context is valid: {{context}}'
  errorMessage?: string = 'Context is invalid: {{context}}'

  context: string

  async run({
    target,
    context
  }: {
    target: string
    context: string | string[]
  }) {
    if (!context) throw new Error('No context provided to check')
    if (!target) target = this.target
    if (!Array.isArray(context)) context = [context]
    for (const ctx of context) {
      await this.checkContext(ctx, target)
    }
  }

  async checkContext(context, target) {
    switch (context) {
      case 'inProject':
        return await this.inProject(target)
      case 'notInProject':
        return await this.notInProject(target)
      case 'inPandaProject':
        return await this.inPandaProject(target)
      case 'notInPandaProject':
        return await this.inPandaProject(target, true)
      default:
        throw new Error(`Unknown context: ${context}`)
    }
  }

  async inPanda() {}

  async inProject(cwd) {
    const packageJson = await this.getPackageJson(cwd, 'return')
    if (packageJson === false)
      throw new Error('Needs to be run inside a project')
  }

  async notInProject(cwd) {
    const packageJson = await this.getPackageJson(cwd, 'return')
    if (packageJson === true)
      throw new Error('Cannot be run inside a project')
  }

  async inPandaProject(cwd, not = false) {
    const packageJson = await this.getPackageJson(cwd, 'return')
    if (not && packageJson === true && packageJson.panda)
      throw new Error('Cannot be run inside a Panda project')
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
