import { isServer } from '@tanstack/react-query';
import { FetchQueryOptions } from '@tanstack/react-query';
import { apiClient, API } from '../api';
import { AxiosRequestConfig } from 'axios';

export const queryCurrentUser = (): FetchQueryOptions => ({
  queryKey: ['current user'],
  queryFn: async () => {
    let headers: AxiosRequestConfig | undefined;
    if (isServer) {
      const { headers: getHeaders } = await import('next/headers');
      headers = getHeaders() as AxiosRequestConfig;
    }

    const { data } = await apiClient.get(API.currentUser(), headers);
    return data;
  },
});
