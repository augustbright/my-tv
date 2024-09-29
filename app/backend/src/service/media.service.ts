import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import { Storage } from '@google-cloud/storage';
import { getEnvVar } from 'server-utils';
import { randomUUID } from 'crypto';
import { TranscoderServiceClient } from '@google-cloud/video-transcoder';

const storage = new Storage();
const transcoder = new TranscoderServiceClient();

const projectId = getEnvVar('GOOGLE_CLOUD_PROJECT_ID');
const bucketName = getEnvVar('GOOGLE_CLOUD_MEDIA_BUCKET_NAME');
const transcoderLocation = 'europe-west1';

export const mediaService = {
  async upload(file: UploadedFile) {
    try {
      const filename = `${randomUUID()}_${file.name}`;
      const [uploadedFile] = await storage
        .bucket(bucketName)
        .upload(file.tempFilePath, {
          destination: `drafts/${filename}`,
        });
      console.log(
        'parent',
        transcoder.locationPath(projectId, transcoderLocation)
      );
      const [createdJob] = await transcoder.createJob({
        parent: transcoder.locationPath(projectId, transcoderLocation),
        job: {
          inputUri: uploadedFile.cloudStorageURI.toString(),
          outputUri: `gs://${bucketName}/transcoded/${filename}/`,
          templateId: 'preset/web-hd',
          config: {
            elementaryStreams: [
              {
                key: 'video_stream0',
                videoStream: {
                  vp9: {
                    heightPixels: 720,
                    widthPixels: 1280,
                    bitrateBps: 2500000,
                    frameRate: 30,
                  },
                },
              },
              {
                key: 'audio_stream0',
                audioStream: {
                  codec: 'aac',
                  bitrateBps: 128000,
                  sampleRateHertz: 44100,
                  channelCount: 2,
                },
              },
            ],
            muxStreams: [
              {
                key: 'sd',
                container: 'mp4',
                elementaryStreams: ['video_stream0', 'audio_stream0'],
              },
            ],
            pubsubDestination: {
              topic: `projects/${projectId}/topics/video-transcoding-notifications`,
            },
          },
        },
      });
      return {
        fileUploaded: true,
        job: createdJob.name,
      };
    } catch (error) {
      console.error(error);
      return {
        fileUploaded: false,
      };
    } finally {
      fs.unlink(file.tempFilePath);
    }
  },
};
