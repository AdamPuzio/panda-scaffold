import { ScaffoldAction } from './action'

export class ScaffoldActionCustom extends ScaffoldAction {
  name = 'custom'
  description = 'Custom action'

  async run(action, data, factory) {
    if (!action.run) throw new Error('No run() method provided')
    return await action.run(action, data, factory)
  }
}
