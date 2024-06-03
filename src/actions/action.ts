import path from 'path'
import { Factory } from '../factory'

export class ScaffoldAction {
  __type: string = 'ScaffoldAction'

  static name: string = 'action'
  static description: string = ''

  sourceBase?: string
  source?: string
  targetBase?: string
  target?: string

  data: { [key: string]: any } = {}

  startMessage?: string
  successMessage?: string
  failureMessage?: string

  silent?: boolean = false

  constructor (cfg) {
    return this.init(cfg)
  }

  init (cfg) {
    const globals = ['sourceBase', 'source', 'targetBase', 'target', 'startMessage', 'successMessage', 'failureMessage', 'silent', 'run', 'when']
    Object.entries(cfg).forEach(([key, value]) => {
      if (globals.includes(key)) 
        this[key] = value
      else
        this.data[key] = value
    })
    this.run = this.run.bind(this)
    this.when.bind(this)
    return this
  }

  async trigger (data, cfg = {}, opts = { force: false }) {
    const { force = false } = opts
    // add any additional items to the data object
    Object.entries(cfg).forEach(([key, value]) => this.data[key] = value)
    // process the data object
    this.data = this.process(this.data, data)
    this.setPaths(data)
    if (!force) {
      let when = this.when(data)
      if (when instanceof Promise) when = await when
      if (when === false) return
    }
    return this.run(this.data, data)
  }

  async run (data, ctx?) {}

  when (data): Promise<boolean> | boolean { return true }

  _factory?: typeof Factory
  get factory () {
    if (!this._factory)
      this._factory = Factory.clone({
        data: {
          sourceBase: this.sourceBase,
          targetBase: this.targetBase,
          source: this.source,
          target: this.target
        }
      })
    return this._factory
  }

  set factory (factory) {
    this._factory = factory
  }

  setPaths (data) {
    const source = path.join(this.sourceBase || '', this.source || '')
    this.source = this.data.source = this.factory.path(source, data)
    const target = path.join(this.targetBase || '', this.target || '')
    this.target = this.data.target = this.factory.path(target, data)
  }

  process (item, data = {}) {
    if (typeof item === 'string') {
      // it's a template string
      if (item.startsWith('$$')) return this.parseSub(item, data)
      // just a regular string
      return this.factory.render(item, data)
    } else if (Array.isArray(item)) {
      // it's an array, so process each item
      return item.map(d => this.process(d, data))
    } else if (typeof item === 'object') {
      // it's an object, so process each key/value pair
      const obj = {}
      Object.entries(item).forEach(([key, value]) => {
        obj[key] = this.process(value, data || item)
      })
      return obj
    } else {
      // dunno, just return it
      return item
    }
  }

  /**
   * Parse a $$ variable
   * 
   * @param {string} str    string to parse
   * @param {object} data   data object to search for variable
   * @returns 
   */
  parseSub (str, data={}) {
    const [varname, defaultVal] = str.slice(2).split('|')
    if (!Object.hasOwn(data, varname)) {
      if (typeof defaultVal !== 'undefined') {
        // if defaultVal is a template string, parse it
        if (defaultVal.startsWith('$$')) return this.parseSub(defaultVal, data)
        // if defaultVal specifies a type, parse it
        if (defaultVal.includes(':')) {
          let [ValType, val] = defaultVal.split(':')
          val = val.trim()
          switch (ValType.trim()) {
            case 'int':
              return parseInt(val)
            case 'float':
              return parseFloat(val)
            case 'bool':
              return val === 'true'
            default:
              return val
          }
        }
        return defaultVal.trim()
      }
      throw new Error(`Variable ${varname} not found in data`)
    }
    return data[varname]
  }

  status (msgType, defaultMsg?) {
    let msg = defaultMsg
    switch (msgType) {
      case 'start':
        if (this.startMessage)  msg = this.startMessage
        break
      case 'success':
        if (this.successMessage) msg = this.successMessage
        break
      case 'fail':
        if (this.failureMessage) msg = this.failureMessage
        break
    }
    if (msg) return this.factory.render(msg, this.data)
    return
  }

}
