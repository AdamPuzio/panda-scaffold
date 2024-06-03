import { CommandProps } from '@panda/command'

export interface ScaffoldProps extends CommandProps {
  scaffoldDir?: string
  cwd?: string
  // actions?: ScaffoldActionProps[]
  tasks?: ScaffoldActionProps[]
  actionTypes?: {
    [key: string]: any
  }
  title?: string
}

// deprecated
export interface ScaffoldActionProps {
  type: string
  source?: string
  target?: string
  [key: string]: any
}

export interface ScaffoldTaskProps {
  type: string
  title?: string
  source?: string
  target?: string
  successMessage?: string
  failureMessage?: string
  [key: string]: any
}

export interface FactoryCloneConfig {
  sourceBase?: string
  targetBase?: string
  _source?: string
  _target?: string
  source?: string
  target?: string
  data?: {
    [key: string]: any
  }
}
