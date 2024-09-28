'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './queries/queryClient';

const queryClient = getQueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
