import { jest } from '@jest/globals'

import { executeCommand } from '../src/utilities'

describe('utilities tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.useRealTimers()
  })

  describe('executeCommand', () => {
    test('when commands succeeds, should resolve', async () => {
      await expect(
        executeCommand({ command: 'echo "Tue Oct 28 15:23:31 EDT 2025"' })
      ).resolves.toEqual(['Tue', 'Oct', '28', '15:23:31', 'EDT', '2025'])
    })
    test('when command fails, should reject', async () => {
      await expect(
        executeCommand({
          command: `node -e "throw new Error('failedCommand')"`
        })
      ).rejects.toContain('failedCommand')
    })
  })
})
