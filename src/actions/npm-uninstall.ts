import path from 'path'

import { ScaffoldAction } from './action'

export class NpmUninstallScaffoldAction extends ScaffoldAction {
  static name = 'npm:uninstall'
  static description = 'Uninstall NPM packages'

  startMessage?: string = 'Uninstalling NPM packages'
  successMessage?: string = 'NPM packages uninstalled'
  errorMessage?: string = 'Failed to uninstall NPM packages'

  packageManager: string = 'npm'

  async run({
    packages,
    params = [],
    target,
    packageManager = 'npm'
  }: {
    packages: string | string[]
    params?: string[]
    target?: string
    packageManager?: 'npm' | 'yarn'
  }) {
    if (!packages) throw new Error('No packages provided to uninstall')

    packages = Array.isArray(packages) ? packages : [packages]

    const packageManagerCli = packageManager === 'yarn' ? 'yarn remove' : 'npm uninstall'

    const cd = target ? `cd ${target} && ` : ''
    await this.factory.runCommand(`${cd}${packageManagerCli} ${packages.join(' ')} ${params.join(' ')}`)
  }
}
