import { useMemo } from 'react'

import { mergeBalancesWithCurrencies } from '../utils/mergeBalances'

import { useCurrencies } from './useCurrencies'
import { useBalances } from './useBalances'

export function useEnrichedCurrencyData() {
  const {
    data: currencies,
    isLoading: loadingCurrencies,
    error: errorCurrencies,
  } = useCurrencies()
  const {
    data: balances,
    isLoading: loadingBalances,
    error: errorBalances,
  } = useBalances()

  const enriched = useMemo(() => {
    return mergeBalancesWithCurrencies(currencies, balances)
  }, [currencies, balances])

  return {
    data: enriched,
    isLoading: loadingCurrencies || loadingBalances,
    error: errorCurrencies || errorBalances,
  }
}
