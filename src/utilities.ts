import { exec } from 'node:child_process'
import * as core from '@actions/core'

export const executeCommand = async (params: {
  command: string
  hideOutput?: boolean
  override?: typeof exec
}): Promise<string[]> => {
  const { command, override } = params
  const execToUse = override ?? exec

  return new Promise<string[]>((resolve, reject) => {
    execToUse(command, (error, stdout, stderr) => {
      if (params.hideOutput) {
        core.info(`stdout hidden`)
      } else {
        core.info(`stdout::`)
        core.info(stdout)
      }

      if (stderr) {
        core.info(`stderr::`)
        core.info(stderr)
      }

      if (error) {
        core.info(`Command failed`)
        core.error(error)
        return reject(stderr)
      }

      core.info(`Command succeeded`)
      return resolve(
        stdout
          .split(/\s+/) // split on any whitespace including newlines
          .map((x: string) => x.trim())
          .filter((x: string) => x.length > 0)
      )
    })
  })
}
