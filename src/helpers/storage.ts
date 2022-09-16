import colors from 'ansi-colors';
import cliProgress from 'cli-progress';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import logger from '../log';
import pLimit from 'p-limit';

const limit = pLimit(5);
/**
 * Get bucket region
 * @param s3 S3 instance
 * @param bucket bucket key
 */
export const getRegion = async (s3: AWS.S3, bucket: string): Promise<string> => {
  try {
    const location = await s3
      .getBucketLocation({ Bucket: bucket })
      .promise()
      .catch(() => null);
    const region = location?.LocationConstraint;
    if (!region) throw new Error('No bucket exists');

    return region;
  } catch (error) {
    // logger.error(`No bucket found with name: "${bucket}"`);
    throw new Error(`No bucket found with name: "${bucket}"`);
  }
};

const uploadFile = async (file: string, bucket: string, s3: AWS.S3, bar: cliProgress.SingleBar): Promise<boolean> => {
  const content = fs.readFileSync(path.join(process.cwd(), file));
  const Key = file.replace('./out/', '');
  const params = {
    Bucket: bucket,
    Key,
    Body: content,
    ContentType: mime.lookup(file.split('.').pop() || file) as any,
    CacheControl: 'immutable,public',
  };

  try {
    await s3.upload(params).promise();

    if (file.endsWith('.html')) {
      const copyTarget = Key.replace(/\.html$/, '');
      const copyParams = {
        Bucket: bucket,
        CopySource: `/${bucket}/${Key}`,
        Key: copyTarget,
      };
      await s3.copyObject(copyParams).promise();
    }
    bar.increment(1);

    return true;
  } catch (error: any) {
    logger.error(`Failed to upload file: "${file.split('/').pop()}": ${error.message}`);
    return false;
  }
};

/**
 * Upload files to S3
 * @param s3 s3 bucket name
 * @param bucket name of the target bucket
 * @param files list of files
 */
export const uploadFiles = async (s3: AWS.S3, bucket: string, files: string[]) => {
  const fileList = files.filter((file) => !['.DS_Store'].some((ext) => file.endsWith(ext)));

  const bar = new cliProgress.SingleBar({
    format: 'Uploading files |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} files',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  });

  bar.start(fileList.length, 0, {});

  await Promise.all(fileList.map((file) => limit(() => uploadFile(file, bucket, s3, bar))));
  bar.stop();
};

/**
 * Configure bucket for website hosting
 * @param region name of the region
 * @param bucket name of the bucket
 */
export const configureBucket = async (s3: AWS.S3, bucket: string) => {
  const websiteParams = {
    Bucket: bucket,
    ContentMD5: '',
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: '404.html',
      },
      IndexDocument: {
        Suffix: 'index.html',
      },
    },
  };
  await s3.putBucketWebsite(websiteParams).promise();

  const policyParams = {
    Bucket: bucket,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      BlockPublicPolicy: false,
      IgnorePublicAcls: false,
      RestrictPublicBuckets: false,
    },
  };
  await s3.putPublicAccessBlock(policyParams).promise();

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

  await s3.putBucketPolicy({ Bucket: bucket, Policy: policy }).promise();
};
