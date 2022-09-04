const logger = require('./log');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');

const managers = ['yarn', 'npm'];

const getFlags = (options) => {
  return Object.entries(options)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `--${key} ${typeof value === 'string' ? value : ''}`.trim())
    .join(' ');
};
const deploy = (options) => {
  const { profile, publicKey, secretKey, bucket, distribution, basepath, env, verbose, manager } = options;
  logger.log(`Preparing deploy`, '🛠 ', 1, 7);

  if (verbose) {
    logger.verbose({
      CWD: process.cwd(),
      'AWS profile': profile,
      'AWS Public Key': publicKey,
      'AWS Secret Key': secretKey,
      'AWS S3 Bucket Name': bucket,
      'AWS Cloudfront Distribution Id': distribution,
      'Deployment basepath': basepath,
      'Env file location': env,
      'Package manager': manager,
    });
  }

  if (!managers.includes(manager)) {
    logger.error(`Project manager '${manager}' is not supported`);
    process.exit(-1);
  }
  if (!bucket) {
    logger.error(`No S3 bucket specified`);
    process.exit(-1);
  }

  const awsOptions = { profile };

  const command = (cmd) => `${manager} run ${cmd}`;
  const exec = (cmd) => {
    const _cmd = cmd.replace(/\n/g, '').trim();
    if (verbose) console.log(chalk.white.bold('Executing'), chalk.gray(_cmd));
    return shell.exec(_cmd, { silent: !verbose });
  };

  logger.log(`Building project`, '🧱', 2, 7);
  const buildResult = exec(command('next build'), { silent: !verbose });
  if (buildResult.code !== 0) {
    logger.error(`Failed to build project ${buildResult.stderr}`);
    return process.exit(1);
  }

  logger.log(`Exporting to static`, '⚙️ ', 3, 7);
  const exportResult = exec(command('next export'), { silent: !verbose });
  if (exportResult.code !== 0) {
    logger.error(`Failed to export project ${exportResult.stderr}`);
    return process.exit(1);
  }

  logger.log('Uploading static files', '⚡️', 4, 7);

  const copyOptions = {
    ...awsOptions,
    'cache-control': 'immutable,max-age=100000000,public',
    recursive: true,
  };

  const nextResult = exec(`aws s3 cp ./out s3://${bucket} ${getFlags(copyOptions)}`);
  if (nextResult.code !== 0) {
    const line = nextResult.stderr.split('\n')[0];
    const segments = line.split(' ');
    const error = segments.slice(5).join(' ');
    logger.error(`Failed to upload static files: ${error}`);
    return process.exit(1);
  }

  try {
    exec(`aws s3 cp ./static/ s3://${bucket}/static/ ${getFlags(copyOptions)}`);
  } catch (error) {}

  logger.log('Uploading pages', '📑', 5, 7);

  const pagesResult = exec(`find ./out -type f -name '*.html'`);
  const pages = pagesResult.stdout.split('\n').filter(Boolean);
  try {
    pages.forEach((page) => {
      page = page.replace('./out/', '');
      exec(`aws s3 cp s3://${bucket}/${page} s3://${bucket}/${page.replace(/.html$/, '')} ${getFlags(awsOptions)}`);
    });
  } catch (error) {
    logger.error('Failed to rename pages');
    return process.exit(1);
  }

  logger.log('Configuring Static Website Hosting', '⛓ ', 6, 7);

  const websiteOptions = {
    ...awsOptions,
    'index-document': 'index.html',
    'error-document': 'index.html',
  };
  exec(`aws s3 website s3://${bucket} ${getFlags(websiteOptions)}`);

  const policy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });

  const accessOptions = {
    ...awsOptions,
    bucket,
    'public-access-block-configuration':
      '"BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"',
  };
  exec(`aws s3api put-public-access-block  ${getFlags(accessOptions)}`);

  try {
    fs.writeFileSync('./out/policy.json', policy);
    exec(`aws s3api put-bucket-policy ${getFlags({ ...awsOptions, bucket, policy: 'file://out/policy.json' })}`);
    fs.rmSync('./out/policy.json');
  } catch (error) {}

  if (!distribution) {
    logger.log('No AWS Cloudfront has been defined, skipping...', '☁️', 7, 7);
  } else {
    logger.log('Invalidating AWS Cloudfront cache', '☁️ ', 7, 7);
    try {
      const distributionOptions = {
        ...awsOptions,
        id: distribution,
        'if-match': distribution,
        'distribution-config': 'file://out/distribution.json',
      };
      fs.writeFileSync('./out/distribution.json', policy);
      exec(`aws cloudfront update-distribution ${getFlags(distributionOptions)}`);
      fs.rmSync('./out/distribution.json');
    } catch (error) {}
    const distributionOptions = {
      ...awsOptions,
      'distribution-id': distribution,
      paths: '"/*"',
    };
    exec(`aws cloudfront create-invalidation ${getFlags(distributionOptions)}`);
  }

  console.log(
    chalk.reset('👏'),
    chalk.greenBright.bold('Site successfully deployed on AWS S3!'),
    chalk.reset.gray.italic('It may take a couple of minutes to complete the invalidation.'),
  );
};

module.exports = deploy;
