import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log({session})

  if (!session) {
    const url = req.nextUrl.clone();
    const requestedPage = req.page.name;
    url.pathname = `/auth/login`;
    url.search = `?p=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  const validRoles = ['admin', 'superuser'];

  if (!validRoles.includes(session.user.role)) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  // si si es admin o superuser,etc puede pasar 
  return NextResponse.next();
}
