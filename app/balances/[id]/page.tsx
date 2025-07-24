'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
} from '@heroui/react'

import { useEnrichedCurrencyData } from '@/lib/api/useEnrichedCurrencyData'
import ArrowLeftIcon from '@/components/icons/arrow-left'
import ArrowTrendingUpIcon from '@/components/icons/arrow-trending-up'

export default function BalanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useEnrichedCurrencyData()
  const { data: session } = useSession()

  const primaryColor =
    session?.user?.userType === 'partner' ? '#119DA4' : '#2AFC98'

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Spinner color="primary" size="lg" />
          <p className="text-default-500">Loading currency details...</p>
        </div>
      </div>
    )
  }

  const currencyData = data?.find((group) => group.currency_id === id)

  if (error || !currencyData) {
    return (
      <div className="from-background to-default-50 min-h-screen bg-gradient-to-br p-4">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardBody className="py-12 text-center">
              <p className="text-danger mb-4 text-lg">
                {String(error) || 'Currency not found'}
              </p>
              <Link href="/dashboard">
                <Button
                  startContent={<ArrowLeftIcon className="h-4 w-4" />}
                  style={{ backgroundColor: primaryColor, color: 'white' }}
                >
                  Back to Dashboard
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  isIconOnly
                  aria-label="Back to dashboard"
                  style={{ color: primaryColor }}
                  variant="light"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currencyData.symbol}</span>
                <div>
                  <h1 className="font-mono text-2xl font-bold">
                    {currencyData.code}
                  </h1>
                  <p className="text-default-500">Currency Details</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <div className="mb-2 flex items-center justify-center">
                <ArrowTrendingUpIcon
                  className="mr-2 h-5 w-5"
                  style={{ color: primaryColor }}
                />
                <span className="text-small text-default-500">
                  Total Amount
                </span>
              </div>
              <p className="text-2xl font-bold">{currencyData.total}</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <div className="mb-2 flex items-center justify-center">
                <span className="text-small text-default-500">
                  Number of Balances
                </span>
              </div>
              <div className="flex justify-center">
                <Chip
                  size="lg"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor,
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                  variant="flat"
                >
                  {currencyData.balances.length}
                </Chip>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <div className="mb-2 flex items-center justify-center">
                <span className="text-small text-default-500">
                  Average Balance
                </span>
              </div>
              <p className="text-2xl font-bold">
                {(
                  parseFloat(currencyData.total) / currencyData.balances.length
                ).toFixed(2)}
              </p>
            </CardBody>
          </Card>
        </div>
        <Card className="hidden shadow-lg md:block">
          <CardHeader className="p-6 pb-0">
            <h2 className="text-xl font-semibold">Individual Balances</h2>
          </CardHeader>
          <CardBody className="p-0">
            <Table
              aria-label="Individual balances table"
              classNames={{
                wrapper: 'rounded-lg',
                th: 'bg-default-100 text-default-600 font-semibold',
                td: 'py-4',
              }}
            >
              <TableHeader>
                <TableColumn>BALANCE ID</TableColumn>
                <TableColumn align="end">AMOUNT</TableColumn>
                <TableColumn align="end">PERCENTAGE</TableColumn>
              </TableHeader>
              <TableBody>
                {currencyData.balances
                  .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
                  .map((balance) => {
                    const percentage = (
                      (parseFloat(balance.amount) /
                        parseFloat(currencyData.total)) *
                      100
                    ).toFixed(1)

                    return (
                      <TableRow key={balance.id}>
                        <TableCell>
                          <span className="font-mono">#{balance.id}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {balance.amount}
                          </span>
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
                            {percentage}%
                          </Chip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        <div className="space-y-4 md:hidden">
          <Card className="shadow-lg">
            <CardHeader className="p-4 pb-0">
              <h2 className="text-lg font-semibold">Individual Balances</h2>
            </CardHeader>
          </Card>
          {currencyData.balances
            .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
            .map((balance) => {
              const percentage = (
                (parseFloat(balance.amount) / parseFloat(currencyData.total)) *
                100
              ).toFixed(1)

              return (
                <Card key={balance.id} className="shadow-lg">
                  <CardBody className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-small text-default-500 font-mono">
                        Balance #{balance.id}
                      </span>
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                        }}
                        variant="flat"
                      >
                        {percentage}%
                      </Chip>
                    </div>
                    <p className="text-xl font-bold">{balance.amount}</p>
                  </CardBody>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}
