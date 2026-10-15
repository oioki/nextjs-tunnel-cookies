import { NextResponse } from 'next/server';

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set('session', 'sess_demo_s3cr3t_token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return res;
}
