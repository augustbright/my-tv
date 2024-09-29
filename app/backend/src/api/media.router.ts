import { Router } from 'express';
import { mediaService } from '../service/media.service';
import fileUpload from 'express-fileupload';
import { randomUUID } from 'crypto';
import { socketsService } from '../service/sockets.service';

export const mediaRouter = Router();

mediaRouter.post(
  '/upload',
  fileUpload({
    useTempFiles: true,
    abortOnLimit: true,
    limits: {
      files: 1,
      fileSize: 50 * 1024 * 1024,
    },
  }),
  async (req, res) => {
    let file = req.files?.file;
    if (!file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    if (Array.isArray(file)) {
      file = file[0];
    }
    const jobId = randomUUID();
    mediaService
      .upload(file, {
        onProgress(percent) {
          socketsService.sendToUser(req.user.uid, {
            type: 'upload-progress',
            jobId,
            percent,
          });
        },
      })
      .then(() => {
        socketsService.sendToUser(req.user.uid, {
          type: 'upload-finished',
          jobId,
        });
      })
      .catch((error) => {
        socketsService.sendToUser(req.user.uid, {
          type: 'upload-error',
          jobId,
          error: error.message,
        });
        throw error;
      });
    res.send({ jobId });
  }
);
