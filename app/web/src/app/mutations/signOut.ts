import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { API, apiClient } from '../api';
import { getQueryClient } from '../queries/queryClient';
import { KEY } from '../queries/keys';

export const mutateSignOut = (): UseMutationOptions => ({
  mutationFn: async () => {
    await apiClient.post(API.signOut());
    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER,
    });
  },
});

export const useMutateSignOut = () => useMutation(mutateSignOut());
