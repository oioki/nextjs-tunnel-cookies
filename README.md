# nextjs-tunnel-cookies

Next.js app with `@sentry/nextjs` and `tunnelRoute: true`, demonstrating that the browser SDK
forwards first-party cookies (including an `httpOnly` session cookie) to the Sentry tunnel
destination with every envelope.

The tunnel destination is overridden to a local echo server, so you can see the forwarded headers
directly instead of inspecting Sentry's ingest.

## Run

```sh
npm install

# terminal 1 - the stand-in for Sentry ingest
npm run echo            # listens on http://localhost:3113

# terminal 2 - the app (override is baked into the build/dev scripts)
npm run build && npm run start   # http://localhost:3112
# or: npm run dev
```

## Reproduce

The workaround below is enabled by default. Comment out the `transportOptions` line in
`sentry.client.config.ts` and rebuild to see the leak.

1. Open http://localhost:3112 and click **Log in** - this sets an `httpOnly` `session` cookie.
2. Reload the page, or click **Send a test error through the tunnel**.
3. Watch terminal 1. Each tunneled envelope prints a line like:

   ```
   --- tunnel request received ---
   POST /?o=4506&p=4507&r=us
   Cookie: session=sess_demo_s3cr3t_token
   Body: 1234 bytes
   ```

The `session` cookie reaches the tunnel destination even though it is `httpOnly` and cannot be read
from JavaScript: the browser attaches it automatically because the tunnel route is same-origin.

## Workaround

The envelope transport never needs cookies - Sentry authenticates via the DSN. Until the SDK
defaults to it, set this in `Sentry.init` on the client:

```ts
transportOptions: { fetchOptions: { credentials: 'omit' } },
```

With it enabled, the echo server's `Cookie:` line reads `(none)`.

Caveat: on cookie-gated deployments (Vercel Deployment Protection, Cloudflare Access, HTTP Basic
Auth, auth middleware) the gate rejects the cookie-less tunnel request, so events from those
deployments stop reaching Sentry. The pages themselves keep working.
