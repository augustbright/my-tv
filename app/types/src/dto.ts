import { Video } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/auth';

export type TUser = DecodedIdToken;

export type TVideoDto = Video;

export type TVideoForEditingDto = TVideoDto & {
  thumbnails: string[];
};

export type TUpdateVideoDto = Partial<{
  title: string;
  description: string;
  publish: boolean;
}>;
