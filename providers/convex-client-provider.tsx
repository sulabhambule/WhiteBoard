'use client'

import { ReactNode } from 'react'
import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { Loading } from '@/components/auth/loading'


interface ConvexClientProviderProps {
  children: React.ReactNode;
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// export default function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return (
//     <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//       {children}
//     </ConvexProviderWithClerk>
//   )
// }

export default function ConvexClientProvider({
  children,
}: ConvexClientProviderProps) {
  return (
    // <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    // </ClerkProvider>
  );
}