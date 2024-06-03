import { describe, test, expect } from 'vitest'
import { ScaffoldAction } from './action'

describe('arguments', async () => {
  test('basic action', async () => {
    const action = new ScaffoldAction({
      name: 'test',
      description: 'Test action',
      async run() {}
    })
  })
})