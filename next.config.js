const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {},
  {
    tunnelRoute: true,
    silent: true,
  },
);
