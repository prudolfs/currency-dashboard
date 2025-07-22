import { useQuery } from '@tanstack/react-query'
import { Balance } from '@/types'

export function useBalances() {
  return useQuery<Balance[]>({
    queryKey: ['balances'],
    queryFn: async () => {
      const res = await fetch(
        'https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/balances',
      )
      if (!res.ok) throw new Error('Failed to fetch balances')
      return res.json()
    },
  })
}
