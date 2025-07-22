'use client'

import { useEnrichedCurrencyData } from '@/lib/api/useEnrichedCurrencyData'

export default function DashboardPage() {
  const { data, isLoading, error } = useEnrichedCurrencyData()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong: {String(error)}</p>

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Currency Dashboard</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Symbol</th>
            <th className="p-2">Total Balance</th>
            <th className="p-2"># of Balances</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group) => (
            <tr key={group.currency_id} className="border-t">
              <td className="p-2">{group.code}</td>
              <td className="p-2">{group.symbol}</td>
              <td className="p-2">{group.total.toFixed(2)}</td>
              <td className="p-2">{group.balances.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
