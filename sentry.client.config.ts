import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://abcdef1234567890abcdef1234567890@o4506.ingest.us.sentry.io/4507',
  // Trace every page view so a pageload transaction is tunneled on each load, not only on errors.
  tracesSampleRate: 1.0,

  // Temporary workaround for the cookie forwarding until the SDK defaults to it: keeps first-party
  // cookies off the same-origin tunnel request, so the echoed headers contain no `Cookie`.
  // Comment it out to reproduce the leak. Breaks event delivery on cookie-gated deployments
  // (Vercel Deployment Protection, Cloudflare Access, HTTP Basic Auth, auth middleware).
  transportOptions: { fetchOptions: { credentials: 'omit' } },
});
