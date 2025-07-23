'use client'

import Link from 'next/link'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'

import { useFilteredSortedBalances } from '@/lib/hooks/useFilteredSortedBalances'
import ChevronUpDownIcon from '@/components/icons/chevron-up-down'
import EyeIcon from '@/components/icons/eye'
import SearchIcon from '@/components/icons/search'

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    search,
    setSearch,
    setSortField,
    sortOrder,
    setSortOrder,
  } = useFilteredSortedBalances()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Something went wrong: {String(error)}</p>

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Currency Dashboard</h1>
      <div className="mb-4 flex gap-4">
        <Input
          aria-label="Search"
          classNames={{
            inputWrapper: 'bg-default-100 py-4',
            input: 'text-lg',
          }}
          labelPlacement="outside"
          placeholder="Search by currency code..."
          startContent={
            <SearchIcon className="text-default-400 pointer-events-none flex-shrink-0 text-base" />
          }
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Code</th>
            <th className="p-2">Symbol</th>
            <th className="p-2">
              <div className="flex items-center justify-between">
                Total Balance
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => {
                    setSortField('total')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  <ChevronUpDownIcon />
                </Button>
              </div>
            </th>
            <th className="p-2">
              <div className="flex items-center justify-between">
                # of Balances
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => {
                    setSortField('count')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  <ChevronUpDownIcon />
                </Button>
              </div>
            </th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data.map((group) => (
            <tr key={group.currency_id} className="border-t">
              <td className="p-2">{group.code}</td>
              <td className="p-2">{group.symbol}</td>
              <td className="p-2">{group.total}</td>
              <td className="p-2">{group.balances.length}</td>
              <td>
                <Link
                  className="text-blue-500 underline"
                  href={`/balances/${group.currency_id}`}
                >
                  <EyeIcon />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
