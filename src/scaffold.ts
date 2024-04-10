import path from 'node:path'
// @ts-expect-error needed for dual-bundling
import ora from 'ora'
import { Command } from '@panda/command'

import { Factory } from './factory'
import { FactoryCloneConfig, ScaffoldProps } from './scaffold.types'

import {
  ScaffoldActionAdd,
  ScaffoldActionAddMany,
  ScaffoldActionContext,
  ScaffoldActionCustom,
  ScaffoldActionModify,
} from './actions'

const inTest = process.env.NODE_ENV === 'test'

export class Scaffold extends Command {
  scaffoldDir: string
  cwd: string
  actions = []

  actionTypes = {}
  _actionTypes = {
    add: ScaffoldActionAdd,
    addMany: ScaffoldActionAddMany,
    context: ScaffoldActionContext,
    custom: ScaffoldActionCustom,
    modify: ScaffoldActionModify,
  }

  mod = Factory.mod

  constructor(cfg: ScaffoldProps) {
    if (!cfg.command) cfg.command = cfg.name
    super(cfg)

    this.cwd = process.cwd()
    this.scaffoldDir = cfg.scaffoldDir || __dirname
    this.registerActionTypes(cfg.actionTypes)
    if (cfg.actions) this.actions = cfg.actions
    return this
  }

  registerActionTypes(actionTypes = []) {
    Object.entries(actionTypes).forEach(([name, actionType]) => {
      this._actionTypes[name] = actionType
    })
  }

  /**
   * Method to trigger once processed
   *
   * @param {object} args   Arguments
   * @param {object} opts   Options
   * @param {object} etc    Complete object of parsed data
   */
  async action(args, opts, etc) {
    // if action isn't overwritten, output help
    if (opts.help) return this.generateHelp()

    const title = `Running ${this.name} Scaffold`
    this.heading(title)

    await this.runActions(etc.data)
  }

  async runActions(data) {
    for await (const action of this.actions) {
      await this.runAction(action, data)
    }
  }

  async runAction(action, data) {
    const actionType = action.type
    if (!this._actionTypes[actionType])
      this.error(null, `No Action type matches ${actionType}`)

    const spinner = ora({
      stream: inTest ? process.stdout : process.stderr,
      // isEnabled: !inTest && argv.process !== false
    })

    action.cwd = this.cwd
    if (!action.sourceBase) action.sourceBase = this.scaffoldDir
    if (!action.targetBase) action.targetBase = this.cwd

    const cfg: FactoryCloneConfig = { cwd: this.cwd, data }
    if (action.source) {
      cfg._source = action._source = action.source
      cfg.source = action.source = Factory.path(
        path.join(action.sourceBase, action.source),
        data,
      )
    }
    if (action.target) {
      cfg._target = action._target = action.target
      cfg.target = action.target = Factory.path(
        path.join(action.targetBase, action.target),
        data,
      )
    }
    const factory = Factory.clone(cfg)

    const actionInstance = new this._actionTypes[actionType](action)

    try {
      // run the when event handler, skip if false
      let when = actionInstance.when(action, data, factory)
      if (when instanceof Promise) when = await when
      if (when === false) return

      spinner.start(factory.path(actionInstance.startMessage || actionType))
      const successMsg = await actionInstance.run(action, data, factory)
      spinner.succeed(
        factory.path(
          action.successMessage || successMsg || actionInstance.successMessage,
        ),
      )
    } catch (err) {
      spinner.fail(
        factory.path(
          action.errorMessage ||
            actionInstance.errorMessage ||
            `${actionType} FAILED`,
        ),
      )
      this.error(err)
    }
    return
  }
}

export default Scaffold
