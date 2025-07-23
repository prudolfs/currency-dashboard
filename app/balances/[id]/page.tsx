'use client'

import { useParams } from 'next/navigation'

import { useEnrichedCurrencyData } from '@/lib/api/useEnrichedCurrencyData'

export default function BalanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useEnrichedCurrencyData()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {String(error)}</p>

  const currencyGroup = data.find((group) => group.currency_id === id)

  if (!currencyGroup) {
    return <p>Currency not found.</p>
  }

  return (
    <div className="p-4">
      <h1 className="mb-2 text-2xl font-bold">
        Currency: {currencyGroup.code}
      </h1>
      <p className="mb-4 text-gray-700">
        <strong>Symbol:</strong> {currencyGroup.symbol} <br />
        <strong>Total Amount:</strong> {currencyGroup.total} <br />
        <strong># of Balances:</strong> {currencyGroup.balances.length}
      </p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Balance ID</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {currencyGroup.balances.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2">{b.id}</td>
              <td className="p-2">{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
