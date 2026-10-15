'use client';

import * as Sentry from '@sentry/nextjs';

export function ThrowButton() {
  return (
    <button
      style={{ padding: '8px 14px', cursor: 'pointer' }}
      onClick={async () => {
        const id = Sentry.captureException(new Error('tunnel-cookie-demo error'));
        await Sentry.flush(2000);
        alert(`Sent error ${id} through the tunnel - check the echo server output.`);
      }}
    >
      Send a test error through the tunnel
    </button>
  );
}
