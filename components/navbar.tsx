import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar'
import { Link } from '@heroui/link'
import NextLink from 'next/link'
import { ThemeSwitch } from '@/components/theme-switch'
import { GithubIcon, Logo } from '@/components/icons'

export function Navbar() {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">CURRENCY DASHBOARD</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 sm:flex sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <Link
            isExternal
            aria-label="Github"
            href="https://github.com/prudolfs/currency-dashboard"
          >
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
        <Link
          isExternal
          aria-label="Github"
          href="https://github.com/prudolfs/currency-dashboard"
        >
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  )
}
