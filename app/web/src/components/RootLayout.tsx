import React from 'react';
import { AppHeader } from './AppHeader';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <AppHeader />
      <main className="flex flex-col">{children}</main>
    </div>
  );
};
