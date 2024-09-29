'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { getQueryClient } from './queries/queryClient';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer hideProgressBar position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
};
