import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import { Storage, TransferManager } from '@google-cloud/storage';
import { getEnvVar } from 'server-utils';
import { randomUUID } from 'crypto';
import { transcodeService } from './transcode.service';
import { prisma } from './prisma.service';
import { TUser } from 'types';
import { socketsService } from './sockets.service';
import { Video } from '@prisma/client';

const storage = new Storage();
const bucketName = getEnvVar('GOOGLE_CLOUD_MEDIA_BUCKET_NAME');
const transferManager = new TransferManager(storage.bucket(bucketName));

const rootOutputFolder = 'tmp/transcoded/';

type TUploadMediaParams = {
  author: TUser;
};

export const mediaService = {
  async upload(file: UploadedFile, config: TUploadMediaParams) {
    const video = await prisma.video.create({
      data: {
        authorId: config.author.uid,
        title: file.name,
      },
    });

    processVideo(file, video);
    return video;
  },
};

async function processVideo(file, video: Video) {
  try {
    const filename = `${randomUUID()}_${file.name}`;
    const outputFolder = `${rootOutputFolder}${filename}/`;

    const tempFilePath = file.tempFilePath;
    await fs.rename(file.tempFilePath, tempFilePath);
    const transcoded = await transcodeService.transcode(tempFilePath, {
      onProgress: (percent) => {
        socketsService.sendToUser(video.authorId, {
          type: 'upload-progress',
          video,
          percent,
        });
      },
      outputFolder: `${outputFolder}`,
      filename,
    });
    await transferManager.uploadManyFiles(outputFolder, {
      customDestinationBuilder(path) {
        const relPath = path.split(outputFolder).at(-1);
        return `transcoded/${filename}/${relPath}`;
      },
    });

    const thumbnailsGSUrl = `gs://${bucketName}/transcoded/${filename}/${transcoded.thumbnailsFolder}`;
    const videoGSUrl = `gs://${bucketName}/transcoded/${filename}/${transcoded.videoFolder}`;
    const masterGsUrl = `gs://${bucketName}/transcoded/${filename}/${transcoded.videoFolder}/${transcoded.masterName}`;

    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        status: 'DRAFT',
        location: {
          thumbnailsGSUrl,
          videoGSUrl,
          masterGsUrl,
        },
      },
    });

    socketsService.sendToUser(video.authorId, {
      type: 'upload-finished',
      video,
    });
  } catch (error) {
    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        status: 'ERROR',
      },
    });

    socketsService.sendToUser(video.authorId, {
      type: 'upload-error',
      video,
      error: error.message,
    });
  } finally {
    await fs.rm(rootOutputFolder, { recursive: true });
    await fs.rm(file.tempFilePath);
  }
}
