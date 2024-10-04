export const KEY = {
  CURRENT_USER: ['current user'],
  MY_MEDIA: ['my media'],
  VIDEO: (id: string) => ['video', id],
} as const;
