import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|sign-in|sign-up).*)', // allow public routes
    '/(api|trpc)(.*)',
  ],
};
