# Mantine NextJS Template

Get started with the template by clicking `Use this template` button on the top of the page.

Includes the following

- Mantine UI with Aarsleff theme
- Mantine Notifications
- Mantine Modals Manager
- Mantine Date
- Clerk with Azure Entra SSO
- PWA support from serwist
- Tabler Icons

## Auth (Clerk / AarAuth)

All Aarsleff apps share a single Clerk instance ("AarAuth"), so signing into any one app signs users into all of them via Azure Entra SSO. This repo only consumes that shared instance — there's no local user database or webhook handler for user sync.

### Route protection — `proxy.ts`

This project uses the **Pages Router**, so Clerk middleware lives in `proxy.ts` at the repo root (not `middleware.ts`/`app` dir). `clerkMiddleware` wraps every route matched by `config.matcher` (everything except `_next`/static assets, plus always for `/api`).

- `isPublicRoute` exempts `/sign-in`, `/sign-up`, `/api/webhooks`, `/unauthorized`.
- Every other route: `auth.protect()` requires sign-in, then reads `sessionClaims.metadata.appAccess`.
- **On-demand app-access sync**: because the SSO session is shared across apps, a user can be signed in without ever having synced access for *this* app, leaving `appAccess.template` `undefined`. When that happens, `proxy.ts` fetches a token and calls `POST https://aartravel.aarsleff.co.uk/api/sync-access` (external AarTravel endpoint) to pull a fresh `appAccess` before deciding access. If `appAccess.template` is still missing, the user is redirected to `/unauthorized?redirect_url=...`, which polls `session.reload()` every 3s (up to 5 tries) until access appears, then bounces back.
- **Route-level permission checks**: `/export*` requires `admin`, `/users*` and `/api/users*` require `userAdmin`. Both are read from a **scoped Clerk JWT template** (see below), not the main session claims.

### `ClerkProvider` setup — `pages/_app.tsx`

Minimal — just `<ClerkProvider {...pageProps}>`. Sign-in/up URLs and redirects are configured entirely via env vars, read automatically by `@clerk/nextjs` (no props needed):

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

### Sign-in / Entra SSO — `pages/sign-in/[[...sign-in]].tsx`

Custom UI (not Clerk's `<SignIn/>` component) that calls `signIn.sso()` directly with the `enterprise_sso` strategy:

```tsx
signIn?.sso({
  strategy: "enterprise_sso",
  enterpriseConnectionId,       // NEXT_PUBLIC_CLERK_ENTERPRISE_CONNECTION_ID
  identifier: enterpriseSsoIdentifier,
  redirectUrl,
  redirectCallbackUrl: redirectUrl,
});
```

- `enterpriseConnectionId` is the `samlc_...` id of the Enterprise SSO connection in the Clerk dashboard, set via `NEXT_PUBLIC_CLERK_ENTERPRISE_CONNECTION_ID`.
- `enterpriseSsoIdentifier` comes from a stored cookie, falling back to `NEXT_PUBLIC_CLERK_ENTERPRISE_SSO_IDENTIFIER` (e.g. `sso@aarsleff.co.uk`).
- There's no separate sign-up page — provisioning happens centrally in AarAuth/Entra.

### Permissions via scoped JWT template

Per-app permissions (`admin`, `userAdmin`) are **not** on the main session token. Instead each app defines its own **Clerk JWT Template** in the dashboard (this template names it `"template"` as a placeholder) that exposes a `permissions` claim scoped to that app.

- `lib/permissions.ts` defines `TemplatePermissions` (`admin`, `userAdmin` booleans) and `pickPermissions()` to fill defaults.
- `lib/jwt.ts` exports `decodeJwtPayload` — a plain base64url decode of the JWT payload (no signature check needed, Clerk already verified it at issuance).
- Client-side: `hooks/useAppPermission.ts` calls `session.getToken({ template: "template" })` and decodes it (Clerk caches the token ~60s).
- Server-side: `proxy.ts` and `pages/api/users.ts` do the same via `auth.getToken({ template: "template" })` / `getAuth(req).getToken(...)`.

**When cloning this template for a new app**, rename `"template"` and `TemplatePermissions`/`TEMPLATE_PERMISSIONS` throughout (`lib/permissions.ts`, `lib/jwt.ts` usages, `hooks/useAppPermission.ts`, `proxy.ts`, `pages/api/users.ts`) to your app's own name, and create a matching JWT Template in the Clerk dashboard with a `permissions` claim shaped like `lib/permissions.ts`.

### Migrating permissions to AarAuth

`scripts/migrate-clerk-permissions.mjs` is a one-off admin script for copying `publicMetadata.permissions.template` from a standalone app's own Clerk instance over to the shared AarAuth instance, matching users by email:

```bash
TEMPLATE_CLERK_SECRET_KEY=sk_... AARAUTH_CLERK_SECRET_KEY=sk_... \
  node scripts/migrate-clerk-permissions.mjs [--dry-run]
```

Not needed for a fresh app already built on the shared instance — only for migrating an older standalone app.

### Setting up a new app on AarAuth

1. In the Clerk dashboard for the shared AarAuth instance, create a JWT Template scoped to your app, with a `permissions` claim (e.g. `{ "admin": "{{user.public_metadata.permissions.<app>.admin}}", "userAdmin": "{{...}}" }`). Rename `"template"` throughout the code to match the template name you choose.
2. Confirm/create the Enterprise SSO connection (Azure Entra) and copy its `samlc_...` id.
3. Set the env vars below in `.env`.
4. Ensure your app is registered with the AarTravel sync-access endpoint so `appAccess` gets populated for first-time sessions.

### Env vars

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for the shared AarAuth instance |
| `CLERK_SECRET_KEY` | Clerk secret key for the shared AarAuth instance |
| `NEXT_PUBLIC_CLERK_ENTERPRISE_CONNECTION_ID` | Enterprise SSO connection id (`samlc_...`) from the Clerk dashboard |
| `NEXT_PUBLIC_CLERK_ENTERPRISE_SSO_IDENTIFIER` | Default SSO identifier/domain (e.g. `sso@aarsleff.co.uk`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Post-sign-in redirect fallback |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Post-sign-up redirect fallback |
| `TEMPLATE_CLERK_SECRET_KEY` / `AARAUTH_CLERK_SECRET_KEY` | Only used by `scripts/migrate-clerk-permissions.mjs`, not needed at runtime |

`CLIENT_ID` / `CLIENT_SECRET` in `.env.example` are unused legacy vars from a pre-Clerk Entra flow — safe to ignore/remove when setting up a new app.
