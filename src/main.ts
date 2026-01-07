import * as core from '@actions/core'
import { executeCommand } from './utilities.ts'

const setFailedAndCreateError = (message: string): Error => {
  core.setFailed(message)
  return new Error(message)
}

export const run = async (): Promise<{
  latestTag: string
  commitsInLatestRelease: string[]
  commitsSinceLatestRelease: string[]
  headOfLatestRelease: string
  baseSinceLatestRelease: string
  headSinceLatestRelease: string
}> => {
  let baseOverride: string | undefined
  let headOverride: string | undefined
  try {
    core.info('Parsing inputs...')
    baseOverride = core.getInput('baseOverride')
    headOverride = core.getInput('headOverride')
  } catch (error) {
    const errMsg = `Action failed with error: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

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

  let commitsInLatestRelease: string[] = []
  let first10CommitsInLatestRelease: string[] = []
  let last10CommitsInLatestRelease: string[] = []
  try {
    core.info('Listing git tags in latest release...')
    commitsInLatestRelease = await executeCommand({
      command: `git log ${latestTag} --oneline --pretty=format:%H`,
      hideOutput: true
    })

    first10CommitsInLatestRelease = commitsInLatestRelease.slice(0, 10)
    last10CommitsInLatestRelease = commitsInLatestRelease.slice(-10)

    core.info(
      `Commit count in latest tag (${latestTag}): ${commitsInLatestRelease.length}`
    )
    core.info(`First 10 Commits: ${first10CommitsInLatestRelease.join(', ')}`)
    core.info(`Last 10 Commits: ${last10CommitsInLatestRelease.join(', ')}`)
  } catch (error) {
    const errMsg = `Failed to list git tags: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

  if (commitsInLatestRelease.length === 0) {
    const errMsg = 'No commits found in the latest tag'
    throw setFailedAndCreateError(errMsg)
  }

  const headOfLatestRelease = commitsInLatestRelease[0]
  core.info(`Head of Latest Release commit: ${headOfLatestRelease}`)

  let commitsSinceLatestRelease: string[] = []
  try {
    core.info('Listing git tags since latest release...')
    commitsSinceLatestRelease = await executeCommand({
      command: `git log ${latestTag}..HEAD --oneline --pretty=format:%H`,
      hideOutput: true
    })
    core.info(
      `Commits since latest tag (${latestTag}): ${commitsSinceLatestRelease.length}`
    )
    core.info(`Commits: ${commitsSinceLatestRelease.join(', ')}`)
  } catch (error) {
    const errMsg = `Failed to list git tags: ${error}`
    throw setFailedAndCreateError(errMsg)
  }

  if (commitsSinceLatestRelease.length === 0) {
    if (baseOverride && headOverride) {
      core.info(
        `No commits found since latest tag, but baseOverride and headOverride were provided. Using those values.`
      )
      commitsSinceLatestRelease = [headOverride, baseOverride]
    } else {
      const errMsg = 'No commits found since the latest tag'
      throw setFailedAndCreateError(errMsg)
    }
  }

  const baseSinceLatestRelease =
    commitsSinceLatestRelease[commitsSinceLatestRelease.length - 1]
  const headSinceLatestRelease = commitsSinceLatestRelease[0]
  core.info(`Base commit: ${baseSinceLatestRelease}`)
  core.info(`Head commit: ${headSinceLatestRelease}`)
  core.info(`Base override: ${baseOverride}`)
  core.info(`Head override: ${headOverride}`)

  // set outputs
  core.setOutput('latestTag', latestTag)
  core.setOutput('commitsInLatestRelease', commitsInLatestRelease.join(', '))
  core.setOutput(
    'commitsSinceLatestRelease',
    commitsSinceLatestRelease.join(', ')
  )
  core.setOutput('headOfLatestRelease', headOfLatestRelease)
  core.setOutput('baseSinceLatestRelease', baseSinceLatestRelease)
  core.setOutput('headSinceLatestRelease', headSinceLatestRelease)

  // return outputs for testing purposes
  return {
    latestTag,
    commitsInLatestRelease,
    commitsSinceLatestRelease,
    headOfLatestRelease,
    baseSinceLatestRelease,
    headSinceLatestRelease
  }
}
