export const API = {
  api: (route: string) => route,
  user: (route: string) => API.api(`/user${route}`),
  verifyToken: () => API.user(`/verifyToken`),
  sessionLogin: () => API.user('/sessionLogin'),
  signOut: () => API.user('/sign-out'),
  currentUser: () => API.user('/current'),
};
