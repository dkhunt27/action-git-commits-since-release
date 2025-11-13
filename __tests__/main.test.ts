import { jest } from '@jest/globals'
import { run } from '../src/main'

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('main tests', () => {
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
        baseSinceLatestRelease: '7bd70b4069073cfd557fbf91c7f43e7b74b1b532',
        commitsInLatestRelease: [
          'bbeda8053547fedc4f8968d10cec7eb0e170727f',
          '0897759e3024be5c3c3c5cfbfcabd90687dff99a',
          '91aa6490582ef5ac9125cfaca56c29781237b026',
          'ea4ad1ee7fe2133e80efda710eacf464f8a90186',
          '3ea1b5b1fc5486231f09ffec81c92139c186c559',
          'd613369f60135172646a288f149490de7a619725',
          '9024d7a1490113d97ef977c0f1a3c8e853a0f091',
          'ecb911adf31d2966b31c89b17a5cda0ccdec3002',
          '268788fcafda7d68b45697cba8f60e4bd9d05f52'
        ],
        commitsSinceLatestRelease: ['7bd70b4069073cfd557fbf91c7f43e7b74b1b532'],
        headOfLatestRelease: 'bbeda8053547fedc4f8968d10cec7eb0e170727f',
        headSinceLatestRelease: '7bd70b4069073cfd557fbf91c7f43e7b74b1b532',
        latestTag: 'v0'
      })
    })
  })
})
