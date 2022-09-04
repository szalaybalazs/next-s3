const chalk = require("chalk");

const log = (message, emoji, step, maxStep) =>
  console.log(
    chalk.gray(`[${step}/${maxStep}]`),
    `${chalk.reset(emoji)}  ${chalk.reset(message)}...`
  );
const error = (message) => {
  console.log(
    chalk.red.bold("⚠️  Failed to deploy site: "),
    chalk.reset(message)
  );
};

const verbose = (entries) => {
  Object.entries(entries).forEach(([key, value]) => {
    console.log(
      chalk.reset.bold(`${key}:`),
      !value ? chalk.gray("-") : chalk.reset(value)
    );
  });
};

module.exports = { log, verbose, error };
