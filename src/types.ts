export interface iAwsProps {
  profile?: string;
  publicKey?: string;
  privateKey?: string;
}

export interface iStorageProps extends iAwsProps {
  bucket: string;
  distribution?: string;
  basepath?: string;
}

export interface iDeployProps extends iStorageProps {
  manager: 'yarn' | 'npm';
  env?: string;
}
