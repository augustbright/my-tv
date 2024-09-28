import { isServer, FetchQueryOptions, useQuery } from '@tanstack/react-query';
import { apiClient, API } from '../api';
import { AxiosRequestConfig } from 'axios';
import { KEY } from './keys';

export const queryCurrentUser = (): FetchQueryOptions => ({
  queryKey: KEY.CURRENT_USER,
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

export const useQueryCurrentUser = () => useQuery(queryCurrentUser());
