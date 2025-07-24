import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { encode } from 'next-auth/jwt'

import { users, validateOtp } from '../users'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.requiresTwoFactor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userType = token.userType as keyof typeof users
    const isValid = validateOtp(userType, code)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 },
      )
    }

    const updatedToken = {
      ...token,
      twoFactorVerified: true,
    }

    const newToken = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET || '',
    })

    const response = NextResponse.json({ success: true })

    const expirationTime =
      typeof token.exp === 'number'
        ? new Date(token.exp * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000)

    response.cookies.set('next-auth.session-token', newToken, {
      expires: expirationTime,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 },
    )
  }
}
