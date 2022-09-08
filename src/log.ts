const chalk = require('chalk');

/**
 * Log step into console
 * @param message step message
 * @param emoji step emoji
 * @param step step number
 * @param maxStep total number of steps
 */
const log = (message: string, emoji: string, step: number, maxStep: number) => {
  console.log(chalk.gray(`[${step}/${maxStep}]`), `${chalk.reset(emoji)}  ${chalk.reset(message)}...`);
};

/**
 * Log error into console
 * @param message error message
 */
const error = (message: string) => {
  console.log(chalk.red.bold('⚠️  Failed to deploy site: '), chalk.reset(message));
};

/**
 * Verbose log object
 * @param entries entry object
 */
const verbose = (entries: any) => {
  Object.entries(entries).forEach(([key, value]) => {
    console.log(chalk.reset.bold(`${key}:`), !value ? chalk.gray('-') : chalk.reset(value));
  });
};

const logger = {
  verbose,
  log,
  error,
};
export default logger;
