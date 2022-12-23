import fs from 'fs';
import path from 'path';

const RESOURCES_PATH = 'resources';

export const readDirForMDX = (paths: string[]) =>
  fs
    .readdirSync(path.join(process.cwd(), RESOURCES_PATH, ...paths))
    .filter((path) => /\.mdx?$/.test(path));

export const readMDXContent = (paths: string[]) =>
  fs.readFileSync(path.join(process.cwd(), RESOURCES_PATH, ...paths), {
    encoding: 'utf-8',
  });
