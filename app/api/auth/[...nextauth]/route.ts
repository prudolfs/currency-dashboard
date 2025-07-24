import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { users } from '../users'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.userType
        ) {
          throw new Error('Missing credentials')
        }

        if (
          credentials.userType !== 'member' &&
          credentials.userType !== 'partner'
        ) {
          throw new Error('User type mismatch')
        }

        const user = users[credentials.userType]

        if (!user) {
          throw new Error('User not found')
        }

        const isValid = user.password === credentials.password

        if (!isValid) {
          throw new Error('Password is incorrect')
        }

        const result = {
          id: user.id,
          email: user.email,
          userType: user.type,
          requiresTwoFactor: Boolean(user.otp),
        }

        return result
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60 * 2,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType
        token.requiresTwoFactor = user.requiresTwoFactor
      }

      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id
      session.user.userType = token.userType

      if (token.requiresTwoFactor && !token.twoFactorVerified) {
        session.requiresTwoFactor = true
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verify: '/auth/verify-otp',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
