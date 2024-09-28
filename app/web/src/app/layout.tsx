import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import './global.css';
import { Providers } from './Providers';
import { queryCurrentUser } from './queries/currentUser';
import { getQueryClient } from './queries/queryClient';

export const metadata = {
  title: 'Welcome to web',
  description: 'Generated by create-nx-workspace',
};

const queryClient = getQueryClient();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await queryClient.prefetchQuery(queryCurrentUser());

  return (
    <Providers>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <html lang="en">
          <body>
            <div>hi</div>
            {children}
          </body>
        </html>
      </HydrationBoundary>
    </Providers>
  );
}
