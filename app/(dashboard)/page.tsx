'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { Loading } from '@/components/auth/loading';

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk auth to load
  if (!isLoaded) {
    return <Loading />;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // User is signed in
  return <Content />;
}

function Content() {
  return <div>This is a dashboard</div>;
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
