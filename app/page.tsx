import { cookies } from 'next/headers';
import Link from 'next/link';
import { ThrowButton } from './ThrowButton';

export default async function Home() {
  const session = (await cookies()).get('session');

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 680, margin: '40px auto', lineHeight: 1.6 }}>
      <h1>Sentry tunnelRoute cookie forwarding demo</h1>

      <p>
        Session cookie: <strong>{session ? session.value : '(not logged in)'}</strong>
      </p>
      <p>
        {session ? (
          <Link href="/logout">Log out</Link>
        ) : (
          <Link href="/login">Log in (sets an httpOnly session cookie)</Link>
        )}
      </p>

      <hr />

      <p>
        The browser SDK POSTs every envelope to the same-origin tunnel route, so the browser attaches
        the <code>session</code> cookie - even though it is <code>httpOnly</code> and unreadable from
        JavaScript. Next.js then rewrites the request to the tunnel destination with the headers intact.
      </p>
      <p>
        Watch the echo server output: each pageload transaction and the error below arrive carrying the
        full <code>Cookie</code> header.
      </p>

      <ThrowButton />
    </main>
  );
}
