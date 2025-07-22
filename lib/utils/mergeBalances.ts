import { Balance, Currency, EnrichedBalanceGroup } from '@/types'

export function mergeBalancesWithCurrencies(
  currencies?: Currency[],
  balances?: Balance[],
): EnrichedBalanceGroup[] {
  if (!currencies || !balances) {
    return []
  }

  const currencyMap = Object.fromEntries(currencies.map((c) => [c.id, c]))
  const grouped: Record<
    string,
    Omit<EnrichedBalanceGroup, 'total'> & { total: number }
  > = {}

  for (const balance of balances) {
    const currency = currencyMap[balance.currency_id]
    if (!currency) {
      continue
    }

    if (!grouped[balance.currency_id]) {
      grouped[balance.currency_id] = {
        currency_id: balance.currency_id.toString(),
        code: currency.code,
        symbol: currency.symbol,
        balances: [],
        total: 0,
      }
    }

    grouped[balance.currency_id].balances.push(balance)
    grouped[balance.currency_id].total += Math.round(
      Number(balance.amount) * 100,
    )
  }

  return Object.values(grouped).map((group) => ({
    ...group,
    total: Number(group.total / 100).toFixed(2),
  }))
}
