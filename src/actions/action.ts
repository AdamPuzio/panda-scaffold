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
}
