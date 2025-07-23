import { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      userType: 'member' | 'partner'
    } & DefaultSession['user']
    requiresTwoFactor?: boolean
  }

  interface User {
    userType: 'member' | 'partner'
    requiresTwoFactor?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    userType: 'member' | 'partner'
    requiresTwoFactor?: boolean
    twoFactorVerified?: boolean
  }
}
