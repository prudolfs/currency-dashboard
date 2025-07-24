import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const token = await getToken({ req: request })
  const isAuth = !!token

  const isSignInPage = pathname === '/auth/signin'
  const isVerifyOtpPage = pathname === '/auth/verify-otp'
  const isAuthPage = isSignInPage || isVerifyOtpPage

  const requiresTwoFactor = token?.requiresTwoFactor === true
  const hasTwoFactorVerified = token?.twoFactorVerified === true

  const sensitiveRoutes = ['/dashboard']
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isAuthPage) {
    if (isAuth) {
      if (requiresTwoFactor && !hasTwoFactorVerified && !isVerifyOtpPage) {
        return NextResponse.redirect(new URL('/auth/verify-otp', request.url))
      }

      if (!requiresTwoFactor || hasTwoFactorVerified) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return NextResponse.next()
  }

  if (isAccessingSensitiveRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (requiresTwoFactor && !hasTwoFactorVerified) {
      return NextResponse.redirect(new URL('/auth/verify-otp', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
