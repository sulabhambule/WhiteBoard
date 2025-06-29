'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <div className="h-screen flex justify-center items-center">
          <div className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
            <SignInButton mode="redirect">
              Sign In
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser);
  return <div>Messages: {messages?.length}</div>;
}
