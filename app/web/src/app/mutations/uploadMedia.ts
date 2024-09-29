import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { API, apiClient } from '../api';

const validateMediaFile = (media: File) => {
  if (media.size > 50 * 1024 * 1024) {
    return 'File size is too large';
  }

  if (!media.type.startsWith('video/')) {
    return 'File type is not supported';
  }

  return null;
};

export const mutateUploadMedia = (): UseMutationOptions<
  unknown,
  Error,
  File
> => ({
  mutationFn: async (file) => {
    const error = validateMediaFile(file);
    if (error) {
      throw new Error(error);
    }
    const formData = new FormData();

    formData.append('file', file, file.name);

    const result = await apiClient.post(API.uploadMedia(), formData);
    return result;
  },
});

export const useMutateUploadMedia = () => useMutation(mutateUploadMedia());
