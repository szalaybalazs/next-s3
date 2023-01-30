import { iDeployProps } from '../types';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

export const parseDotenv = (options: iDeployProps): iDeployProps => {
  const envPath = path.join(process.cwd(), options.env || '.env');

  if (!fs.existsSync(envPath)) return options;

  const config = dotenv.parse(fs.readFileSync(envPath));

  return {
    ...options,
    profile: config.NEXT_S3_PROFILE || options.profile,
    publicKey: config.NEXT_S3_PUBLIC_KEY || options.publicKey,
    privateKey: config.NEXT_S3_PRIVATE_KEY || options.privateKey,
    bucket: config.NEXT_S3_BUCKET || options.bucket,
    distribution: config.NEXT_S3_DISTRIBUTION || options.distribution,
    basepath: config.NEXT_S3_BASEPATH || options.basepath,
    skipConfig: Boolean(config.NEXT_S3_SKIP_CONFIG || options.skipConfig || false),
  };
};
