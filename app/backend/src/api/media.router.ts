import { Router } from 'express';
import { mediaService } from '../service/media.service';
import fileUpload from 'express-fileupload';
import { guard } from '../middleware/guard';

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
    const video = await mediaService.upload(file, {
      author: req.user,
    });
    res.send(video);
  }
);

mediaRouter.get('/my', guard(), async (req, res) => {
  const myMedia = await mediaService.getUserMedia(req.user);
  res.json({
    data: myMedia,
  });
});

mediaRouter.get('/:id', async (req, res) => {
  res.json(await mediaService.getMediaById(req.params.id));
});

mediaRouter.get('/edit/:id', guard(), async (req, res) => {
  const video = await mediaService.getMediaForEditingById(req.params.id);
  res.json(video);
});

mediaRouter.patch('/:id', guard(), async (req, res) => {
  const video = await mediaService.patch(req.params.id, req.body);
  res.json(video);
});
