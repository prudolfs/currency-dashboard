export const users = {
  member: {
    id: '1000',
    email: 'member@valid.email',
    password: 'Member123!',
    otp: '151588',
    type: 'member',
  },
  partner: {
    id: '2000',
    email: 'partner@valid.email',
    password: 'Partner123!',
    otp: '262699',
    type: 'partner',
  },
} as const

export function findUserByType(userType: 'member' | 'partner') {
  return users[userType]
}

export function validateOtp(
  userType: 'member' | 'partner',
  code: string,
): boolean {
  const user = users[userType]

  return user?.otp === code
}
