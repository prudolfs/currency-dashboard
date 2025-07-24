import { renderHook, act } from '@testing-library/react'
import { useFilteredSortedBalances } from './useFilteredSortedBalances'
import type { EnrichedBalanceGroup } from '@/types'

const mockData: EnrichedBalanceGroup[] = [
  {
    currency_id: 'btc',
    code: 'BTC',
    symbol: '₿',
    balances: [
      { id: '1', amount: '1', currency_id: 1 },
      { id: '2', amount: '1', currency_id: 1 },
    ],
    total: '2.0',
  },
  {
    currency_id: 'eth',
    code: 'ETH',
    symbol: 'Ξ',
    balances: [{ id: '3', amount: '5', currency_id: 2 }],
    total: '5.0',
  },
  {
    currency_id: 'usdt',
    code: 'USDT',
    symbol: '₮',
    balances: [
      { id: '4', amount: '1', currency_id: 3 },
      { id: '5', amount: '1', currency_id: 3 },
      { id: '6', amount: '1', currency_id: 3 },
    ],
    total: '1.0',
  },
]

jest.mock('@/lib/api/useEnrichedCurrencyData', () => ({
  useEnrichedCurrencyData: () => ({
    data: mockData,
    isLoading: false,
    error: null,
  }),
}))

describe('useFilteredSortedBalances', () => {
  it('returns sorted data by total desc by default', () => {
    const { result } = renderHook(() => useFilteredSortedBalances())
    expect(
      result.current.data.map((g: EnrichedBalanceGroup) => g.code),
    ).toEqual(['ETH', 'BTC', 'USDT'])
  })

  it('filters by search', () => {
    const { result } = renderHook(() => useFilteredSortedBalances())
    act(() => {
      result.current.setSearch('bt')
    })
    expect(
      result.current.data.map((g: EnrichedBalanceGroup) => g.code),
    ).toEqual(['BTC'])
  })

  it('sorts by count asc', () => {
    const { result } = renderHook(() => useFilteredSortedBalances())
    act(() => {
      result.current.setSortField('count')
      result.current.setSortOrder('asc')
    })
    expect(
      result.current.data.map((g: EnrichedBalanceGroup) => g.code),
    ).toEqual(['ETH', 'BTC', 'USDT'])
  })

  it('returns loading and error states', () => {
    const {
      useEnrichedCurrencyData,
    } = require('@/lib/api/useEnrichedCurrencyData')
    useEnrichedCurrencyData.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: 'error',
    })
    const { result } = renderHook(() => useFilteredSortedBalances())
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe('error')
    expect(result.current.data).toEqual([])
  })
})
