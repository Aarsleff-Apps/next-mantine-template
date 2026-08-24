import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { decodeJwtPayload } from '@/lib/jwt';
import type { TemplatePermissions } from '@/lib/permissions';

const isAdminRoute = createRouteMatcher(['/export(.*)']);
const isUserAdminRoute = createRouteMatcher(['/users(.*)', '/api/users(.*)']);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/unauthorized',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
    const { sessionClaims } = await auth();
    let appAccess = sessionClaims?.metadata?.appAccess;

    // appAccess missing entirely (not just false) means this session's app
    // list has never been synced for this app - likely an SSO session
    // created while signed into a different app. Re-sync once on demand
    // instead of trusting the stale/absent claim.
    if (appAccess?.template === undefined) {
      const token = await (await auth()).getToken();
      const syncRes = await fetch('https://aartravel.aarsleff.co.uk/api/sync-access', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);
      if (syncRes?.ok) {
        appAccess = (await syncRes.json()).appAccess;
      }
    }

    if (!appAccess?.template) {
      const url = new URL('/unauthorized', req.url);
      url.searchParams.set('redirect_url', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }
  // Protect all admin / user-admin routes
  if (isAdminRoute(req) || isUserAdminRoute(req)) {
    const token = await (await auth()).getToken({ template: 'template' });
    const permissions = token
      ? decodeJwtPayload<{ permissions?: TemplatePermissions }>(token).permissions
      : undefined;

    if (isAdminRoute(req) && !permissions?.admin) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
    if (isUserAdminRoute(req) && !permissions?.userAdmin) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
