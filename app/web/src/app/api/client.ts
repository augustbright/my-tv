import { isServer } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = isServer
  ? `http://${process.env.SERVICE_BACKEND_HOSTNAME}:${process.env.SERVICE_BACKEND_PORT}/${process.env.SERVICE_BACKEND_GLOBAL_PREFIX}`
  : process.env.NEXT_PUBLIC_SERVICE_WEB_API_PREFIX;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});
