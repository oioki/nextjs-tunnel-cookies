# nextjs-tunnel-cookies

Next.js app with `@sentry/nextjs` and `tunnelRoute: true`, demonstrating that the browser SDK
forwards first-party cookies (including an `httpOnly` session cookie) to the Sentry tunnel
destination with every envelope.

The tunnel destination is overridden at build time to a header echo endpoint
(`https://dev.oioki.me/headers/`), so you can see the forwarded headers directly instead of
inspecting Sentry's ingest. The echo comes back as the tunnel response: open the tunnel request
in the browser DevTools Network tab to read it. Set `TUNNEL_DESTINATION` to use another endpoint.

## Variants

Each variant is a branch with its own Vercel deployment. The project uses Standard Protection, so
`main` (production, https://nextjs-tunnel-cookies.vercel.app/) is public and every other branch
deploys behind Vercel Deployment Protection.

| Variant | Branch | Protection | `credentials: 'omit'` | Server tunnel handler | Events delivered | Cookies forwarded |
|---|---|---|---|---|---|---|
| E | `main` | no | no | no | yes | yes (app cookies) |
| A | `protected-sdk-default` | yes | no | no | yes | yes (app cookies and `_vercel_jwt`) |
| B | `protected-credentials-omit` | yes | yes | no | no, redirected to Vercel SSO | no |
| C | `protected-tunnel-handler` | yes | no | yes | yes | no |

The server tunnel handler comes from
[getsentry/sentry-javascript#25456](https://github.com/getsentry/sentry-javascript/pull/25456).

## Run

```sh
npm install
npm run build && npm run start   # http://localhost:3112
# or: npm run dev
```

To use the bundled local echo server instead, which prints each request to the terminal:

```sh
npm run echo                                              # terminal 1, http://localhost:3113
TUNNEL_DESTINATION=http://localhost:3113/ npm run dev     # terminal 2
```

On Vercel the default `build` script is used, so the deployment tunnels to the echo endpoint
unless `TUNNEL_DESTINATION` is set in the project's environment variables.

## Reproduce

1. Open http://localhost:3112 and click **Log in** - this sets an `httpOnly` `app_session` cookie.
2. Reload the page, or click **Send a test error through the tunnel**.
3. In DevTools, open the tunnel request (`/<random>?o=4506&p=4507&r=us`). Its response lists the
   headers the destination received, including:

   ```
   "Cookie": "app_session=sess_demo_s3cr3t_token"
   ```

   With the local echo server, terminal 1 prints the same `Cookie:` line instead.

The `app_session` cookie reaches the tunnel destination even though it is `httpOnly` and cannot be read
from JavaScript: the browser attaches it automatically because the tunnel route is same-origin.

## Workaround

The envelope transport never needs cookies - Sentry authenticates via the DSN. Until the SDK
defaults to it, set this in `Sentry.init` on the client:

```ts
transportOptions: { fetchOptions: { credentials: 'omit' } },
```

With it enabled, the echoed headers contain no `Cookie`.

Caveat: on cookie-gated deployments (Vercel Deployment Protection, Cloudflare Access, HTTP Basic
Auth, auth middleware) the gate rejects the cookie-less tunnel request, so events from those
deployments stop reaching Sentry. The pages themselves keep working.
