import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log({session})

  if (!session) {
    return new Response(
      JSON.stringify({
        message: 'No autenticado',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const validRoles = ['admin', 'superuser'];

  if (!validRoles.includes(session.user.role)) {
    return new Response(
      JSON.stringify(
        {
          message: 'No autorizado',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
    );
  }
  // si si es admin o superuser,etc puede ver el GET
  return NextResponse.next();
}
