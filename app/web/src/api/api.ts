export const API = {
  api: (route: string) => route,
  feed: (route: string) => API.api(`/feed${route}`),
  feedLatest: () => API.feed('/latest'),
  // TODO feedPopular: () => API.feed('/popular'),
  // TODO feedSubscription: () => API.feed('/subscription'),
  user: (route: string) => API.api(`/user${route}`),
  media: (route: string) => API.api(`/media${route}`),
  mediaById: (id: string) => API.media(`/${id}`),
  verifyToken: () => API.user(`/verifyToken`),
  sessionLogin: () => API.user('/sessionLogin'),
  signOut: () => API.user('/sign-out'),
  currentUser: () => API.user('/current'),
  uploadMedia: () => API.media('/upload'),
  updateMedia: (id: string) => API.media(`/${id}`),
  myMedia: () => API.media('/my'),
  videoForEditing: (id: string) => API.media(`/edit/${id}`),
};
