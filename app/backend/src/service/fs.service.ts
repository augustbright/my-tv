import fs from 'fs/promises';

export const fsService = {
  async ensureDir(dir: string) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
    return dir;
  },
};
