import { Router } from 'express';
import { mediaService } from '../service/MediaService';

export const mediaRouter = Router();

mediaRouter.post('upload', (req, res) => {
  mediaService.upload();
});
