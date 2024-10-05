import { isServer } from '@tanstack/react-query';
import axios, { AxiosHeaders } from 'axios';

const baseURL = isServer
  ? `http://${process.env.SERVICE_BACKEND_HOSTNAME}:${process.env.SERVICE_BACKEND_PORT}/${process.env.SERVICE_BACKEND_GLOBAL_PREFIX}`
  : `/${process.env.NEXT_PUBLIC_SERVICE_WEB_API_PREFIX}`;

export const getApiClient = async () => {
  let headers: AxiosHeaders | undefined;
  if (isServer) {
    const { headers: getHeaders } = await import('next/headers');
    headers = getHeaders() as unknown as AxiosHeaders;
  }

  return axios.create({
    baseURL,
    withCredentials: true,
    headers,
  });
};

// export const apiClient = axios.create({
//   baseURL,
//   withCredentials: true,
// });
