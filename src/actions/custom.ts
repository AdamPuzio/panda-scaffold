import { ScaffoldAction } from './action'

export class CustomScaffoldAction extends ScaffoldAction {
  static name = 'custom'
  static description = 'Custom action'

  async run({
    handler,
    data = {}
  }: {
    handler: (data: any, ctx: any) => any
    data?: { [key: string]: any }
  }, ctx: any) {
    if (!handler) throw new Error('No handler() method provided')
    return await handler(data, ctx)
  }
}
