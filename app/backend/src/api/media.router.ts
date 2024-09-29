import { Router } from 'express';
import { mediaService } from '../service/media.service';
import fileUpload from 'express-fileupload';

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
    console.log('req.files:', req.files);
    let file = req.files?.file;
    if (!file) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    if (Array.isArray(file)) {
      file = file[0];
    }
    const result = await mediaService.upload(file);
    res.json(result);
  }
);
