'use client';

import { ReactNode } from 'react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { Authenticated, AuthLoading } from 'convex/react';
import { Loading } from '@/components/auth/loading';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <AuthLoading>
        <Loading />
      </AuthLoading>

      <Authenticated>
        {children}
      </Authenticated>
    </ConvexProviderWithClerk>
  );
}
