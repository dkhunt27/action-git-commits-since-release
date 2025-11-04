import * as core from '@actions/core'
import { parseInputs } from './inputs.ts'
import { runNx } from 'action-nx-command-wrapper'
import { executeCommand } from './utilities.ts'

export const run = async (): Promise<void> => {
  const inputs = parseInputs()

  const tags = await executeCommand({ command: 'git tag --sort=-creatordate' })

  if (tags.length === 0) {
    const errMsg = 'No git tags found in the repository'
    core.setFailed(errMsg)
    throw new Error(errMsg)
  }

  // the most recent tag is the lastest release since using --sort=-creatordate
  const latestTag = tags[0]
  core.info(`Latest tag found: ${latestTag}`)

  const commitsSinceLatestTag = await executeCommand({
    command: `git log ${latestTag}..HEAD --oneline --pretty=format:%H`
  })
  if (inputs.isWorkflowsCiPipeline) {
    // used for .github/workflows/ci.yml
    core.info(
      'Skipping running the nx command as skipNxCommand input is set to true'
    )
  } else {
    try {
      await runNx(inputs)
    } catch (error) {
      core.setFailed(error as never)
    }
  }
}
