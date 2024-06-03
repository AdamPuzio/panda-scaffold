import path from 'path'

import { ScaffoldAction } from './action'

export class PathEnsureScaffoldAction extends ScaffoldAction {
  static name = 'path:ensure'
  static description = 'Ensure path exists'

  startMessage?: string = 'Checking path: {{target}}'
  successMessage?: string = 'Path exists: {{target}}'
  errorMessage?: string = 'Path does not exist: {{target}}'

  async run({
    target
  }: {
    target: string
  }) {
    if (!target) throw new Error('No target provided to check')

    // ensure the base target path exists
    this.factory.ensurePath(path.dirname(target))
  }
}
