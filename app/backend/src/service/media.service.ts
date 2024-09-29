import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import { Storage, TransferManager } from '@google-cloud/storage';
import { getEnvVar } from 'server-utils';
import { randomUUID } from 'crypto';
import { transcodeService } from './transcode.service';

const storage = new Storage();
const bucketName = getEnvVar('GOOGLE_CLOUD_MEDIA_BUCKET_NAME');
const transferManager = new TransferManager(storage.bucket(bucketName));

const rootOutputFolder = 'tmp/transcoded/';

type TUploadMediaParams = {
  onProgress: (percent: number) => void;
};

export const mediaService = {
  async upload(file: UploadedFile, { onProgress }: TUploadMediaParams) {
    try {
      const filename = `${randomUUID()}_${file.name}`;
      const outputFolder = `${rootOutputFolder}${filename}/`;
      console.log('outputFolder', outputFolder);

      try {
        await fs.access(outputFolder);
      } catch {
        await fs.mkdir(outputFolder, { recursive: true });
      }

      const tempFilePath = file.tempFilePath;
      await fs.rename(file.tempFilePath, tempFilePath);
      return transcodeService
        .transcode(tempFilePath, {
          onProgress,
          // outputFolder: `${outputFolder}${filename}`,
          outputFolder: `${outputFolder}`,
          filename,
        })
        .then(async () => {
          await transferManager.uploadManyFiles(outputFolder, {
            customDestinationBuilder(path) {
              return `transcoded/${filename}/${path.split('/').at(-1)}`;
            },
          });
        });
    } finally {
      // fs.unlink(file.tempFilePath);
    }
  },
};
