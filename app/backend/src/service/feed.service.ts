import { prisma } from './prisma.service';

export const feedService = {
  async getLatest() {
    const data = await prisma.video.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data };
  },
};
