import AWS from 'aws-sdk';
import { iAwsProps } from '../types';

export const getAws = ({ profile, privateKey, publicKey }: iAwsProps) => {
  if (profile) AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile });
  if (publicKey && privateKey) {
    AWS.config.credentials = new AWS.Credentials({ accessKeyId: publicKey, secretAccessKey: privateKey });
  }
  const s3 = new AWS.S3();
  const cloudfront = new AWS.CloudFront();

  return {
    s3,
    cloudfront,
  };
};
