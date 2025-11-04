import { jest } from '@jest/globals'

import { run } from '../src/main'

describe('main tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.useRealTimers()
  })

  describe('run', () => {
    test('when main succeeds, should resolve', async () => {
      await expect(run()).resolves.toEqual({
        base: 'ecb911adf31d2966b31c89b17a5cda0ccdec3002',
        commits: ['ecb911adf31d2966b31c89b17a5cda0ccdec3002'],
        head: 'ecb911adf31d2966b31c89b17a5cda0ccdec3002',
        latestTag: 'v0.0.0'
      })
    })
  })
})
