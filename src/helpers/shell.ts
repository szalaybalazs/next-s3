import chalk from 'chalk';
import shell from 'shelljs';

/**
 * Format manager command
 * @param cmd base command
 * @param manager node manager
 * @returns
 */
export const command = (cmd: string, manager: string = 'yarn') => `${manager} run ${cmd}`;

/**
 * Execute shell command
 * @param cmd command
 * @param verbose verbose logging
 * @returns
 */
export const exec = (cmd: string, verbose: boolean = false) => {
  const _cmd = cmd.replace(/\n/g, '').trim();
  try {
    if (verbose) console.log(chalk.white.bold('Executing'), chalk.gray(_cmd));
    return shell.exec(_cmd, { silent: !verbose });
  } catch (error) {
    return null;
  }
};
