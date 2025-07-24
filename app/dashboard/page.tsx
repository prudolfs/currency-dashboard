'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardBody,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from '@heroui/react'

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
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
  } = useFilteredSortedBalances()
  const { data: session } = useSession()

  const primaryColor =
    session?.user?.userType === 'partner' ? '#119DA4' : '#2AFC98'

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner color="primary" size="lg" />
          <p className="text-default-500">Loading currency data...</p>
        </div>
      </div>
    )
  }

  if (error) return <p>Something went wrong: {String(error)}</p>

  const getSortIcon = (field: 'total' | 'count') => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 opacity-50" />
    }

    return (
      <ChevronUpDownIcon
        className={`h-4 w-4 transition-transform ${
          sortOrder === 'desc' ? 'rotate-180' : ''
        }`}
        style={{ color: primaryColor }}
      />
    )
  }

  return (
    <div className="from-background to-default-50 min-h-screen bg-gradient-to-br p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="shadow-lg">
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold">Currency Dashboard</h1>
              <p className="text-default-500 mt-1">
                Welcome back, {session?.user?.email} ({session?.user?.userType})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Chip
                size="sm"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  borderColor: `${primaryColor}40`,
                }}
                variant="flat"
              >
                {data.length} Currencies
              </Chip>
              <Button
                variant="light"
                // onPress={handleLogout}
                // startContent={<LogOut className="w-4 h-4" />}
                className="text-danger"
              >
                Logout
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Input
                aria-label="Search currencies"
                className="flex-1"
                placeholder="Search by currency code..."
                startContent={
                  <SearchIcon className="text-default-400 h-4 w-4" />
                }
                value={search}
                onValueChange={setSearch}
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  startContent={getSortIcon('total')}
                  style={{
                    backgroundColor:
                      sortField === 'total' ? primaryColor : 'transparent',
                    borderColor: primaryColor,
                    color: sortField === 'total' ? 'white' : primaryColor,
                  }}
                  variant={sortField === 'total' ? 'solid' : 'bordered'}
                  onPress={() => {
                    setSortField('total')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Sort by Total
                </Button>

                <Button
                  size="sm"
                  startContent={getSortIcon('count')}
                  style={{
                    backgroundColor:
                      sortField === 'count' ? primaryColor : 'transparent',
                    borderColor: primaryColor,
                    color: sortField === 'count' ? 'white' : primaryColor,
                  }}
                  variant={sortField === 'count' ? 'solid' : 'bordered'}
                  onPress={() => {
                    setSortField('count')
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Sort by Count
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="hidden shadow-lg md:block">
          <CardBody className="p-0">
            <Table
              aria-label="Currency balances table"
              classNames={{
                wrapper: 'rounded-lg',
                th: 'bg-default-100 text-default-600 font-semibold',
                td: 'py-4',
              }}
            >
              <TableHeader>
                <TableColumn>CODE</TableColumn>
                <TableColumn>SYMBOL</TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    TOTAL BALANCE
                    <Button
                      isIconOnly
                      aria-label="Sort by total balance"
                      size="sm"
                      variant="light"
                      onPress={() => setSortField('total')}
                    >
                      {getSortIcon('total')}
                    </Button>
                  </div>
                </TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                    # OF BALANCES
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      // onPress={() => toggleSort('balanceCount')}
                      aria-label="Sort by balance count"
                    >
                      {/* {getSortIcon('balanceCount')} */}
                    </Button>
                  </div>
                </TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No currencies found">
                {data.map((group) => (
                  <TableRow key={group.currency_id}>
                    <TableCell>
                      <span className="font-mono font-bold">{group.code}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg">{group.symbol}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{group.total}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                        }}
                        variant="flat"
                      >
                        {group.balances.length}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Link href={`/balances/${group.currency_id}`}>
                        <Button
                          isIconOnly
                          aria-label={`View details for ${group.code}`}
                          size="sm"
                          style={{ color: primaryColor }}
                          variant="light"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <div className="space-y-4 md:hidden">
          {data.length === 0 ? (
            <Card className="shadow-lg">
              <CardBody className="py-12 text-center">
                <p className="text-default-500">No currencies found</p>
              </CardBody>
            </Card>
          ) : (
            data.map((group) => (
              <Card key={group.currency_id} className="shadow-lg">
                <CardBody className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.symbol}</span>
                      <div>
                        <h3 className="font-mono text-lg font-bold">
                          {group.code}
                        </h3>
                        <p className="text-small text-default-500">
                          Currency Code
                        </p>
                      </div>
                    </div>
                    <Link href={`/balances/${group.currency_id}`}>
                      <Button
                        isIconOnly
                        aria-label={`View details for ${group.code}`}
                        style={{ color: primaryColor }}
                        variant="light"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-small text-default-500">
                        Total Balance
                      </p>
                      <p className="text-lg font-semibold">{group.total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-small text-default-500">Balances</p>
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                        }}
                        variant="flat"
                      >
                        {group.balances.length}
                      </Chip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
