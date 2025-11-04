import { exec } from 'node:child_process';
import * as core from '@actions/core';
import type { NxCommandInputs } from './types.ts';

export const executeCommand = async (params: { command: string; override?: typeof exec }): Promise<string[]> => {
  const { command, override } = params;
  const execToUse = override ?? exec;

  return new Promise<string[]>((resolve, reject) => {
    execToUse(command, (error, stdout, stderr) => {
      core.info(`stdout::`);
      core.info(stdout);

      core.info(`stderr::`);
      core.info(stderr);

      if (error) {
        core.info(`Command failed`);
        core.error(error);
        reject(stderr);
        return;
      }
      core.info(`Command succeeded`);
      return resolve(
        stdout
          .split(/\s+/) // split on any whitespace including newlines
          .map((x: string) => x.trim())
          .filter((x: string) => x.length > 0),
      );
    });
  });
};

export const validateInputs = (inputs: NxCommandInputs): void => {
  core.info('Validating inputs...');

  switch (inputs.command) {
    // biome-ignore lint/suspicious: will fall through intentionally because we want to run the targeted logic too
    case 'runManyListedTargetsAndListedProjects': {
      if (inputs.projects.length === 0) {
        throw new Error(`Projects cannot be empty when command is ${inputs.command}.`);
      }
    }
    case 'runManyListedTargetsAndAllProjects':
    case 'runManyListedTargetsAndAffectedProjects':
      if (inputs.targets.length === 0) {
        throw new Error(`Targets cannot be empty when command is ${inputs.command}.`);
      }
      break;
    case 'showAffectedList':
      // this does not take targets
      if (inputs.projects.length > 0) {
        throw new Error(`Projects must be empty when command is ${inputs.command}.`);
      }
      break;
    default:
      throw new Error(`Invalid command: ${inputs.command}`);
  }

  core.info('Inputs are valid.');
};
