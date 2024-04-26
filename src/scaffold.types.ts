import { CommandInterface } from '@panda/command'

export interface ScaffoldProps extends CommandInterface {
  scaffoldDir?: string
  actions?: ScaffoldActionProps[]
  actionTypes?: {
    [key: string]: any
  }
}

export interface ScaffoldActionProps {
  type: string
  source?: string
  target?: string
  [key: string]: any
}

export interface ScaffoldActionTypeProps {}

export interface FactoryCloneConfig {
  cwd: string
  _source?: string
  _target?: string
  source?: string
  target?: string
  data?: {
    [key: string]: any
  }
}
