import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type Currency = {
  id: string
  code: string
  symbol: string
}

export type Balance = {
  id: string
  amount: string
  currency_id: number
}

export type EnrichedBalanceGroup = {
  currency_id: string
  code: string
  symbol: string
  balances: Balance[]
  total: string
}
