import { useQuery } from '@tanstack/react-query'

import { Currency } from '@/types'

export function useCurrencies() {
  return useQuery<Currency[]>({
    queryKey: ['currencies'],
    queryFn: async () => {
      const res = await fetch(
        'https://653fb0ea9e8bd3be29e10cd4.mockapi.io/api/v1/currencies',
      )

      if (!res.ok) throw new Error('Failed to fetch currencies')

      return res.json()
    },
  })
}
