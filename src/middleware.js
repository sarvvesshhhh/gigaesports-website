import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define your public zones
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)", // Allow Clerk to talk to your DB!
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. The Next.js 15 Way: Use the 'auth' parameter directly
  if (!isPublicRoute(request)) {
    await auth.protect(); 
  }
});

export const config = {
  matcher: [
    // 3. Optimized matcher for modern Next.js apps
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};