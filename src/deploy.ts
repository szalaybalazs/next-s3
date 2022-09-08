import chalk from 'chalk';
import { getAws } from './helpers/aws';
import { configureDistribution, invalidate } from './helpers/cloudfront';
import { getFiles } from './helpers/files';
import { command, exec } from './helpers/shell';
import { configureBucket, getRegion, uploadFiles } from './helpers/storage';
import logger from './log';
import { iDeployProps } from './types';

export const deploy = async (options: iDeployProps, build: boolean = false) => {
  const start = Date.now();
  let step = 0;

  const maxSteps = build ? 6 : 4;

  logger.log('Preparing deploy', '🧐', ++step, maxSteps);

  const { s3, cloudfront } = getAws(options);
  const region = await getRegion(s3, options.bucket);

  if (build) {
    logger.log('Building site', '🔧', ++step, maxSteps);
    exec(command('build', options.manager || 'yarn'));

    logger.log('Exporting build', '📤', ++step, maxSteps);
    exec(command('next export', options.manager || 'yarn'));
  }

  logger.log('Uploading files', '📁', ++step, maxSteps);
  const files = getFiles();
  await uploadFiles(s3, options.bucket, files);

  logger.log('Configuring bucket', '🪣', ++step, maxSteps);
  await configureBucket(s3, options.bucket);

  if (options.distribution) {
    logger.log('Configuring cloudfront', '☁️', ++step, maxSteps);
    await configureDistribution(cloudfront, region, options.distribution);
    await invalidate(cloudfront, options.distribution);
  } else logger.log('No cloudfront defined, skipping', '☁️', ++step, maxSteps);

  const delta = Date.now() - start;
  console.log(chalk.reset('🎉'), chalk.bold.white(`Site deployed in ${delta / 1000}s`));
};
