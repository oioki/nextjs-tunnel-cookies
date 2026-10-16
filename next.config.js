const { withSentryConfig } = require('@sentry/nextjs/config');

module.exports = withSentryConfig(
  {},
  {
    tunnelRoute: true,
    silent: true,
  },
);
