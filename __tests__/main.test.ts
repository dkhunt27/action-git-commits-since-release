import { jest } from '@jest/globals'
import { run } from '../src/main'

// eslint-disable-next-line jest/no-disabled-tests
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
        base: 'd613369f60135172646a288f149490de7a619725',
        commits: [
          '3ea1b5b1fc5486231f09ffec81c92139c186c559',
          'd613369f60135172646a288f149490de7a619725'
        ],
        head: '3ea1b5b1fc5486231f09ffec81c92139c186c559',
        latestTag: 'v0.0.2'
      })
    })
  })
})
