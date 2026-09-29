export class ScaffoldAction {
  _type: string = 'scaffold:action'

  name: string
  description: string = ''

  sourceBase?: string
  source?: string
  target?: string

  startMessage?: string
  successMessage?: string
  errorMessage?: string

  constructor(cfg) {
    this.name = cfg.name
    Object.entries(cfg).forEach(([key, value]) => (this[key] = value))
  }

  async run(action, data, factory) {}

  /** Pre-existing bug fix: scaffold.ts's runAction() calls
   *  `actionInstance.when(...)` to decide whether to skip an action, but
   *  this base class never defined it — every action execution was
   *  already broken (`when is not a function`) before this fix, unrelated
   *  to the kernel retrofit. Default: always proceed, matching the
   *  evident intent (conditional skip logic subclasses can override). */
  async when(action, data, factory) {
    return true
  }
}
