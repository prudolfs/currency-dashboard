import { useMemo, useState } from 'react'

import { useEnrichedCurrencyData } from '@/lib/api/useEnrichedCurrencyData'

export type SortField = 'total' | 'count'
export type SortOrder = 'asc' | 'desc'

export function useFilteredSortedBalances() {
  const { data, isLoading, error } = useEnrichedCurrencyData()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('total')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const filteredSortedData = useMemo(() => {
    if (!data) {
      return []
    }

    const filtered = data.filter((group) =>
      group.code.toLowerCase().includes(search.toLowerCase()),
    )

    const sorted = [...filtered].sort((a, b) => {
      const aVal =
        sortField === 'total' ? parseFloat(a.total) : a.balances.length
      const bVal =
        sortField === 'total' ? parseFloat(b.total) : b.balances.length

      if (sortOrder === 'asc') {
        return aVal - bVal
      }

      return bVal - aVal
    })

    return sorted
  }, [data, search, sortField, sortOrder])

  return {
    data: filteredSortedData,
    isLoading,
    error,
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  }
}
