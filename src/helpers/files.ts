import { exec } from './shell';

/**
 * Get files from out directory
 * @returns
 */
export const getFiles = (): string[] => {
  const res = exec(`find ./out -type f`);
  if (!res) throw new Error('Failed to list files.');
  const files = res.stdout.split('\n').filter(Boolean);

  return files;
};
