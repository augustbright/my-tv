'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { getQueryClient } from './queries/queryClient';
import { EditVideoModal } from './_edit_video_modal/edit-video.modal';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ToastContainer hideProgressBar position="bottom-left" theme="dark" />
      <EditVideoModal />
    </QueryClientProvider>
  );
};
