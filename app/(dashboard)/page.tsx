'use client';

import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';
import { Loading } from '@/components/auth/loading';

export default function Home() {
  return (
    <>
      <AuthLoading>
        <Loading />
      </AuthLoading>
      <Authenticated>
        {/* <UserButton /> */}
        <Content />
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  );
}

function Content() {
  return <div>
    This is a dashboard 
  </div>;
}

function RedirectToSignIn() {
  useEffect(() => {
    const redirectUrl = window.location.href; 
    const clerkDomain = 'sunny-cobra-80.accounts.dev'; 

    const signInUrl = `https://${clerkDomain}/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;

    window.location.href = signInUrl;
  }, []);

  return null;
}
