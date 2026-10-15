import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://abcdef1234567890abcdef1234567890@o4506.ingest.us.sentry.io/4507',
  // Trace every page view so a pageload transaction is tunneled on each load, not only on errors.
  tracesSampleRate: 1.0,

  // Fix / workaround for the cookie forwarding: uncomment to keep first-party cookies off the
  // tunnel request. The echo server's `Cookie:` line then shows `(none)`.
  // transportOptions: { fetchOptions: { credentials: 'omit' } },
});
