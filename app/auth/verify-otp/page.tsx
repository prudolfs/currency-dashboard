'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button, Card, CardBody, CardHeader } from '@heroui/react'

export default function VerifyOTPPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  const { data: session, update } = useSession()

  const primaryColor =
    session?.user?.userType === 'partner' ? '#119DA4' : '#2AFC98'

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]

    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)
    setError('')

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex

    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp.join('') }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        setIsVerifying(false)

        return
      }

      await update({ twoFactorVerified: true })

      router.push('/dashboard')
    } catch {
      setError('An error occurred during verification')
      setIsVerifying(false)
    }
  }

  if (session && !session.requiresTwoFactor) {
    router.push('/dashboard')

    return null
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-1 pb-6">
          <h1 className="text-2xl font-bold">OTP Authentication</h1>
          <p className="text-small text-default-500 text-center">
            Please enter the verification code from your authenticator app
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  aria-label={`OTP digit ${index + 1}`}
                  className="border-default-200 focus:border-primary h-12 w-12 rounded-lg border-2 text-center text-lg font-bold transition-colors focus:outline-none"
                  inputMode="numeric"
                  maxLength={1}
                  style={
                    {
                      borderColor: digit ? primaryColor : undefined,
                      '--tw-ring-color': primaryColor,
                    } as React.CSSProperties
                  }
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            {error && (
              <div
                aria-live="polite"
                className="text-danger bg-danger-50 border-danger-200 rounded-lg border p-3 text-center text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              className="w-full font-semibold"
              isDisabled={isVerifying}
              isLoading={isVerifying}
              style={{
                backgroundColor: primaryColor,
                color: 'white',
              }}
              type="submit"
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
