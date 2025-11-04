import * as core from '@actions/core'
import { executeCommand } from './utilities.ts'

const setFailedAndCreateError = (message: string): Error => {
  core.setFailed(message)
  return new Error(message)
}

export const run = async (): Promise<{
  latestTag: string
  commits: string[]
  base: string
  head: string
}> => {
  try {
    core.info('Fetching all git tags...')
    await executeCommand({ command: 'git fetch --tags' })
  } catch (error) {
    const errMsg = `Failed to fetch git tags: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

  let tags: string[] = []
  try {
    core.info('Listing git tags...')
    tags = await executeCommand({ command: 'git tag --sort=-creatordate' })
  } catch (error) {
    const errMsg = `Failed to list git tags: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

  if (tags.length === 0) {
    const errMsg = 'No git tags found in the repository'
    throw setFailedAndCreateError(errMsg)
  }

  // the most recent tag is the lastest release since using --sort=-creatordate
  const latestTag = tags[0]
  core.info(`Latest tag found: ${latestTag}`)

  let commits: string[] = []
  try {
    core.info('Listing git tags...')
    commits = await executeCommand({
      command: `git log ${latestTag}..HEAD --oneline --pretty=format:%H`
    })
    core.info(`Commits since latest tag (${latestTag}): ${commits.length}`)
    core.info(`Commits: ${commits.join(', ')}`)
  } catch (error) {
    const errMsg = `Failed to list git tags: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

  if (commits.length === 0) {
    const errMsg = 'No commits found since the latest tag'
    throw setFailedAndCreateError(errMsg)
  }

  const base = commits[0]
  const head = commits[commits.length - 1]
  core.info(`Base commit: ${base}`)
  core.info(`Head commit: ${head}`)

  // set outputs
  core.setOutput('latestTag', latestTag)
  core.setOutput('commits', commits.join(', '))
  core.setOutput('base', base)
  core.setOutput('head', head)

  return {
    latestTag,
    commits,
    base,
    head
  }
}
