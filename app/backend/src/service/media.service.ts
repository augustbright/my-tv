import fs from 'fs/promises';
import { Storage, TransferManager } from '@google-cloud/storage';
import { getEnvVar } from 'server-utils';
import { randomUUID } from 'crypto';
import { transcodeService } from './transcode.service';
import { prisma } from './prisma.service';
import { TUpdateVideoDto, TUser, TVideoForEditingDto } from 'types';
import { socketsService } from './sockets.service';
import { UploadedFile } from 'express-fileupload';
import { Video } from '@prisma/client';

const storage = new Storage();
const bucketName = getEnvVar('GOOGLE_CLOUD_MEDIA_BUCKET_NAME');
const transferManager = new TransferManager(storage.bucket(bucketName));

const rootOutputFolder = 'tmp/transcoded/';

type TUploadMediaParams = {
  author: TUser;
};

export const mediaService = {
  async getMediaById(id: string) {
    return prisma.video.findUnique({
      where: {
        id,
      },
    });
  },
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

  async patch(id: string, data: TUpdateVideoDto) {
    return prisma.video.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        title: data.title,
        status: data.publish ? 'PUBLISHED' : 'DRAFT',
      },
    });
  },

  async getUserMedia(user: TUser) {
    return prisma.video.findMany({
      where: {
        authorId: user.uid,
      },
    });
  },

  async getMediaForEditingById(id: string): Promise<TVideoForEditingDto> {
    const video = await prisma.video.findUnique({
      where: {
        id,
      },
    });

    const [thumbnails] = await storage.bucket(bucketName).getFiles({
      prefix: `transcoded/${video.folder}/thumbnails/`,
    });

    const thumbnailUrls = thumbnails.map((thumbnail) => thumbnail.publicUrl());

    return {
      ...video,
      thumbnails: thumbnailUrls,
    };
  },
};

async function processVideo(file, video: Video) {
  try {
    const filename = `${randomUUID()}_${file.name}`;
    const outputFolder = `${rootOutputFolder}${filename}/`;

    async function getManyFiles(folder, ending) {
      const allFiles = await fs.readdir(`${outputFolder}${folder}`);
      return allFiles
        .map((file) => `${outputFolder}${folder}/${file}`)
        .filter((file) => file.endsWith(ending));
    }

    async function uploadManyFiles(files) {
      return await transferManager.uploadManyFiles(files, {
        customDestinationBuilder(path) {
          const relPath = path.split(outputFolder).at(-1);
          return `transcoded/${filename}/${relPath}`;
        },
      });
    }

    const tempFilePath = file.tempFilePath;
    const transcoded = await transcodeService.transcode(tempFilePath, {
      onProgress: (percent) => {
        socketsService.sendToUser(video.authorId, {
          type: 'upload-progress',
          video,
          percent,
        });
      },
      outputFolder,
      filename,
    });

    const videoVariantFiles = await getManyFiles(
      transcoded.videoFolder,
      '_variant.m3u8'
    );
    const videoPartsFiles = await getManyFiles(transcoded.videoFolder, '.ts');
    const videoMasterFiles = await getManyFiles(
      transcoded.videoFolder,
      '_master.m3u8'
    );
    const allThumbnailFiles = await getManyFiles(
      transcoded.thumbnailsFolder,
      '.png'
    );

    await uploadManyFiles(videoVariantFiles);
    await uploadManyFiles(videoPartsFiles);
    const [uploadedMasters] = await uploadManyFiles(videoMasterFiles);
    const [uploadedThumbnails] = await uploadManyFiles(allThumbnailFiles);

    await prisma.video.update({
      where: {
        id: video.id,
      },
      data: {
        status: 'DRAFT',
        masterUrl: uploadedMasters[0].publicUrl(),
        thumbnailUrl: uploadedThumbnails[0].publicUrl(),
        folder: filename,
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
