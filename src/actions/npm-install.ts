import path from 'path'

import { ScaffoldAction } from './action'

export class NpmInstallScaffoldAction extends ScaffoldAction {
  static name = 'npm:install'
  static description = 'Install NPM packages'

  startMessage?: string = 'Installing NPM packages'
  successMessage?: string = 'Installed NPM packages'
  errorMessage?: string = 'Failed to install NPM packages'

  async run({
    packages,
    params = [],
    target,
    packageManager = 'npm',
    saveDev = false
  }: {
    packages: string | string[]
    params?: string[]
    target?: string
    packageManager?: 'npm' | 'yarn'
    saveDev?: boolean
  }) {
    packages = Array.isArray(packages) ? packages : [packages]

    if (saveDev) params.push('-D')

    const packageManagerCli = packageManager === 'yarn' ? 'yarn add' : 'npm install'

    const cd = target ? `cd ${target} && ` : ''
    const cmd = `${cd}${packageManagerCli} ${packages.join(' ')} ${params.join(' ')}`
    await this.factory.runCommand(cmd)
  }
}
