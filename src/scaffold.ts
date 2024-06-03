import path from 'node:path'
// @ts-expect-error needed for dual-bundling
import ora from 'ora'
import { Listr, PRESET_TIMER } from 'listr2'
import { Command } from '@panda/command'

import { ScaffoldProps, FactoryCloneConfig } from './scaffold.types'
import { Factory } from './factory'

import {
  ContextScaffoldAction,
  CustomScaffoldAction,
  FileCopyScaffoldAction,
  FileModifyScaffoldAction,
  JsonCreateScaffoldAction,
  NpmInstallScaffoldAction,
  NpmUninstallScaffoldAction,
  PathEnsureScaffoldAction,
} from './actions'

const inTest = process.env.NODE_ENV === 'test'

export class Scaffold extends Command {
  static __type = 'Scaffold'

  scaffoldDir: string
  cwd: string
  actions = []
  tasks = []

  actionTypes = {}
  _actionTypes = {}
  _defaultActionTypes = [
    ContextScaffoldAction,
    CustomScaffoldAction,
    FileCopyScaffoldAction,
    FileModifyScaffoldAction,
    JsonCreateScaffoldAction,
    NpmInstallScaffoldAction,
    NpmUninstallScaffoldAction,
    PathEnsureScaffoldAction,
  ]

  title
  silent = false
  concurrent = false
  exitOnError = true
  taskTimer = false

  mod = Factory.mod

  constructor (cfg: ScaffoldProps) {
    super(cfg)
    Object.entries(cfg).forEach(([key, value]) => (this[key] = value))

    this.scaffoldDir = cfg.scaffoldDir || __dirname
    this.cwd = cfg.cwd || process.cwd()

    this.registerDefaultActionTypes()
    this.registerActionTypes(cfg.actionTypes)
    
    return this
  }

  registerDefaultActionTypes () {
    this._defaultActionTypes.forEach((actionType) => this.registerActionType(actionType))
  }

  registerActionTypes (actionTypes = {}) {
    if (Array.isArray(actionTypes)) 
      actionTypes.forEach((actionType) => this.registerActionType(actionType))
    else 
      Object.entries(actionTypes).forEach(([name, actionType]) => this.registerActionType(actionType, name))
  }

  registerActionType (action, name?) {
    if (!name) name = action.name
    this._actionTypes[name] = action
  }

  /**
   * Method to trigger once processed
   *
   * @param {object} data       raw data object
   * @param {object} details    complete object of parsed data
   */
  async action (data, details) {
    this.heading(this.title || `Running ${this.name} Scaffold`)

    await this.runTasks(data)
  }

  async runTasks (data) {

    const options: {
      exitOnError?: boolean,
      concurrent?: boolean,
      rendererOptions?: {
        timer?: typeof PRESET_TIMER
      }
    } = {
      exitOnError: this.exitOnError,
      concurrent: this.concurrent,
      rendererOptions: {}
    }
    if (this.taskTimer) options.rendererOptions.timer = PRESET_TIMER

    const tasks = new Listr([], options)

    this.tasks.forEach((action) => {
      const task = this.prepareAction(action, data)
      tasks.add(task)
    })
    
    await tasks.run(data)
  }

  prepareAction (action, data) {
    const actionType = action.type

    const exitOnError = typeof action.exitOnError !== 'undefined' ? action.exitOnError : true

    if (!actionType && Array.isArray(action.tasks)) {
      const groupSilent = action.silent || this.silent
      const tasks = []

      action.tasks.forEach((subAction) => {
        const task = this.prepareAction(subAction, data)
        tasks.push(task)
      })

      const options = {
        exitOnError,
        concurrent: typeof action.concurrent !== 'undefined' ? action.concurrent : false,
        rendererOptions: {
          collapseErrors: false,
          showSubtasks: !groupSilent,
          collapseSubtasks: typeof action.collapseSubtasks !== 'undefined' ? action.collapseSubtasks : false,
        }
      }

      return {
        title: action.title,
        enabled: async (ctx): Promise<boolean> => {
          // run the when event handler, skip if false
          if (!action.when) return true
          let when = action.when(data)
          if (when instanceof Promise) when = await when
          return when
        },
        task: (_, task) => task.newListr(tasks, options),
      }
    }

    if (!this._actionTypes[actionType])
      this.error(null, `No Action type matches ${actionType}`)

    delete action.type

    if (!action.sourceBase) action.sourceBase = this.scaffoldDir
    if (!action.targetBase) action.targetBase = this.cwd

    const actionInstance = new this._actionTypes[actionType](action)
    const silent = action.silent || actionInstance.silent || this.silent

    const startMessage = Factory.render(action.title || actionInstance.status('start') || actionType, data)
    const successMessage = Factory.render(action.successMessage || actionInstance.status('success') || '', data)
    const errorMessage = Factory.render(action.failureMessage || actionInstance.status('fail') || `${actionType} FAILED`, data)

    return {
      title: silent ? undefined : startMessage,
      enabled: async (ctx): Promise<boolean> => {
        // run the when event handler, skip if false
        let when = actionInstance.when(data)
        if (when instanceof Promise) when = await when
        return when
      },
      task: async (ctx, task) => {
        try {
          await actionInstance.trigger(ctx, {}, { force: true })
          if (!silent && successMessage !== '') task.title = successMessage
        } catch (err) {
          if (!silent) task.title = errorMessage
          throw err
        }
      }
    }
  }

  // @deprecated
  async runActions (data) {
    for await (const action of this.actions) {
      await this.runAction(action, data)
    }
  }

  // @deprecated
  async runAction (action, data) {
    const actionType = action.type
    if (!this._actionTypes[actionType])
      this.error(null, `No Action type matches ${actionType}`)

    delete action.type

    const spinner = ora({
      stream: inTest ? process.stdout : process.stderr,
      // isEnabled: !inTest && argv.process !== false
    })

    // action.cwd = this.cwd
    if (!action.sourceBase) action.sourceBase = this.scaffoldDir
    if (!action.targetBase) action.targetBase = this.cwd

    const actionInstance = new this._actionTypes[actionType](action)
    const silent = action.silent || actionInstance.silent || this.silent

    try {
      // run the when event handler, skip if false
      let when = actionInstance.when(data)
      if (when instanceof Promise) when = await when
      if (when === false) return

      if (!silent) spinner.start(Factory.render(actionInstance.status('start') || actionType, data))
      const successMsg = await actionInstance.trigger(data, {}, { force: true })
      if (!silent) spinner.succeed(
        Factory.render(
          action.successMessage || successMsg || actionInstance.status('success') || `${actionType} SUCCESS`,
          data
        )
      )
    } catch (err) {
      if (!silent) spinner.fail(
        Factory.render(
          action.errorMessage ||
            actionInstance.status('error') ||
            `${actionType} FAILED`,
          data
        ),
      )
      this.error(err)
      console.log(err)
    }
    return
  }
}

export default Scaffold