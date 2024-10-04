export const API = {
  api: (route: string) => route,
  user: (route: string) => API.api(`/user${route}`),
  media: (route: string) => API.api(`/media${route}`),
  verifyToken: () => API.user(`/verifyToken`),
  sessionLogin: () => API.user('/sessionLogin'),
  signOut: () => API.user('/sign-out'),
  currentUser: () => API.user('/current'),
  uploadMedia: () => API.media('/upload'),
  updateMedia: (id: string) => API.media(`/${id}`),
  myMedia: () => API.media('/my'),
  videoForEditing: (id: string) => API.media(`/edit/${id}`),
};
