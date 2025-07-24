'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {
  Button,
  Input,
  RadioGroup,
  Radio,
  Card,
  CardBody,
  CardHeader,
} from '@heroui/react'
import { useRouter } from 'next/navigation'

import EyeIcon from '@/components/icons/eye'
import EyeOffIcon from '@/components/icons/eye-off'
import MailIcon from '@/components/icons/mail'
import LockIcon from '@/components/icons/lock'

export default function SignIn() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('member')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        userType,
      })

      setIsSubmitting(false)

      if (result?.error) {
        setError(result.error)

        return
      }

      router.refresh()
      if (session?.requiresTwoFactor) {
        router.push('/auth/verify-otp')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('An error occurred during sign in')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-1 pb-6">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-small text-default-500">
            Access your currency dashboard
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              aria-label="Email address"
              label="Email"
              startContent={<MailIcon className="text-default-400 h-4 w-4" />}
              type="email"
              value={email}
              onValueChange={setEmail}
            />

            <Input
              isRequired
              aria-label="Password"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOffIcon className="text-default-400 h-4 w-4" />
                  ) : (
                    <EyeIcon className="text-default-400 h-4 w-4" />
                  )}
                </button>
              }
              label="Password"
              startContent={<LockIcon className="text-default-400 h-4 w-4" />}
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onValueChange={setPassword}
            />

            <RadioGroup
              className="mt-4"
              label="User Type"
              orientation="horizontal"
              value={userType}
              onValueChange={(value) => setUserType(value)}
            >
              <Radio
                classNames={{
                  control:
                    'data-[selected=true]:bg-[#2AFC98] data-[selected=true]:border-[#2AFC98]',
                }}
                value="member"
              >
                Member
              </Radio>
              <Radio
                classNames={{
                  control:
                    'data-[selected=true]:bg-[#119DA4] data-[selected=true]:border-[#119DA4]',
                }}
                value="partner"
              >
                Partner
              </Radio>
            </RadioGroup>

            {error && (
              <div
                aria-live="polite"
                className="text-danger bg-danger-50 border-danger-200 rounded-lg border p-3 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              className="w-full font-semibold"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              style={{
                backgroundColor: userType === 'partner' ? '#119DA4' : '#2AFC98',
                color: 'white',
              }}
              type="submit"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
