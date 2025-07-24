import { useSession } from 'next-auth/react'
import { getUserColor } from '../utils'

export function useUserSession() {
  const { data, ...rest } = useSession()
  const userType = data?.user?.userType || 'member'
  const primaryColor = getUserColor(userType)

  return {
    data,
    primaryColor,
    ...rest,
  }
}
