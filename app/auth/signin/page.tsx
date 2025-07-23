'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('member')
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
    } catch (error) {
      setError('An error occurred during sign in')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign In</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block">User Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="member"
                checked={userType === 'member'}
                onChange={() => setUserType('member')}
                className="mr-2"
              />
              Member
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="partner"
                checked={userType === 'partner'}
                onChange={() => setUserType('partner')}
                className="mr-2"
              />
              Partner
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
