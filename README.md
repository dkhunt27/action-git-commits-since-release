# Action Git Commits Since Release

This is git action that determines the commits since the last release. It
identifies the last commit or the head of the last release, the base since the
last release, and finally the head since the last release.

So, if there are the following commits which are ordered oldest to newest, the
headOfLatestRelease

7bd70b4069073cfd557fbf91c7f43e7b74b1b532 // first commit
bbeda8053547fedc4f8968d10cec7eb0e170727f
0897759e3024be5c3c3c5cfbfcabd90687dff99a
91aa6490582ef5ac9125cfaca56c29781237b026 // tag 1.0.0
ea4ad1ee7fe2133e80efda710eacf464f8a90186
3ea1b5b1fc5486231f09ffec81c92139c186c559
d613369f60135172646a288f149490de7a619725 // tag 1.1.0
9024d7a1490113d97ef977c0f1a3c8e853a0f091
ecb911adf31d2966b31c89b17a5cda0ccdec3002
268788fcafda7d68b45697cba8f60e4bd9d05f52 // last commit / current head

the action would output the following: latestTag: 1.1.0 headOfLatestRelease:
d613369f60135172646a288f149490de7a619725 baseSinceLatestRelease:
9024d7a1490113d97ef977c0f1a3c8e853a0f091 headSinceLatestRelease:
268788fcafda7d68b45697cba8f60e4bd9d05f52

## Usage

> workflow.yml

```yaml
---
- name: Checkout code
  uses: actions/checkout@v5
  with:
    fetch-depth: 0 # IMPORTANT!!! make sure we get full git history; necessary for tag/commit commands

- name: Git Commits Since Release
  id: gitCommitsSinceRelease
  uses: dkhunt27/action-git-commits-since-release@v1

- run: |
    echo "latestTag: ${{ steps.gitCommitsSinceRelease.outputs.latestTag }}"
    echo "headOfLatestRelease: ${{ steps.gitCommitsSinceRelease.outputs.headOfLatestRelease }}"
    echo "baseSinceLatestRelease: ${{ steps.gitCommitsSinceRelease.outputs.baseSinceLatestRelease }}"
    echo "headSinceLatestRelease: ${{ steps.gitCommitsSinceRelease.outputs.headSinceLatestRelease }}"
```

## Test your action locally

The [`@github/local-action`](https://github.com/github/local-action) utility can
be used to test your action locally. It is a simple command-line tool that
"stubs" (or simulates) the GitHub Actions Toolkit. This way, you can run your
TypeScript action locally without having to commit and push your changes to a
repository.

The `local-action` utility can be run in the following ways:

- Visual Studio Code Debugger

  Make sure to review and, if needed, update
  [`.vscode/launch.json`](./.vscode/launch.json)

- Terminal/Command Prompt

  ```bash
  # npx @github/local action <action-yaml-path> <entrypoint> <dotenv-file>
  npx @github/local-action . src/main.ts .env
  ```

You can provide a `.env` file to the `local-action` CLI to set environment
variables used by the GitHub Actions Toolkit. For example, setting inputs and
event payload data used by your action. For more information, see the example
file, [`.env.example`](./.env.example), and the
[GitHub Actions Documentation](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables).

## Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent SemVer release tag of the current branch, by looking at the local data
   available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the tag retrieved in
   the previous step, and validates the format of the inputted tag (vX.X.X). The
   user is also reminded to update the version field in package.json.
1. **Tagging the new release:** The script then tags a new release and syncs the
   separate major tag (e.g. v1, v2) with the new release tag (e.g. v1.0.0,
   v2.1.2). When the user is creating a new major release, the script
   auto-detects this and creates a `releases/v#` branch for the previous major
   version.
1. **Pushing changes to remote:** Finally, the script pushes the necessary
   commits, tags and branches to the remote repository. From here, you will need
   to create a new release in GitHub so users can easily reference the new tags
   in their workflows.
