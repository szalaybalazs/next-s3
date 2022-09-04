#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const deploy = require('./deploy');

program.name('next-s3').description('CLI to deploy any next.js app on S3').version('0.1.0');

program
  .command('deploy')
  .description('Deploy your app on S3')
  .option('-p, --profile <profile>', 'Name of the AWS profile to be used')
  .option('--publicKey <key>', 'Public key of the IAM profile')
  .option('--secretKey <key>', 'Secret key of the IAM profile')
  .option('-b, --bucket <bucket>', 'Name of the S3 bucket')
  .option('-d, --distribution <distributionId>', 'Cloudformation ID to be invalidated')
  .option('-p, --basepath <basePath>', 'Base path of the deployment')
  .option('-e, --env <environment>', 'Path of the .env file to be used')
  .option('--manager <package manager>', 'package manager used to run commands', 'yarn')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(deploy);

program.parse();
