'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { z } from 'zod'
import Image from 'next/image'
import { clientApi } from '@/lib/client-api'

// Validation schemas
const emailSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type EmailInput = z.infer<typeof emailSchema>
type PasswordInput = z.infer<typeof passwordSchema>

// Reusable Form Input Component
const FormInput = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  className = ''
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  error?: string
  className?: string
}) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
)

// Reusable Submit Button Component
const SubmitButton = ({
  isLoading,
  label,
  loadingLabel
}: {
  isLoading: boolean
  label: string
  loadingLabel: string
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors ${
      isLoading ? 'opacity-70 cursor-not-allowed' : ''
    }`}
  >
    {isLoading ? loadingLabel : label}
  </button>
)

// Reusable Message Component
const Message = ({
  type,
  message,
  className = ''
}: {
  type: 'error' | 'success'
  message: string
  className?: string
}) => (
  <div className={`p-3 rounded-md text-sm mb-4 ${
    type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
  } ${className}`}>
    {message}
  </div>
)

export default function PasswordResetPage() {
  const [emailForm, setEmailForm] = useState<EmailInput>({ email: '' })
  const [passwordForm, setPasswordForm] = useState<PasswordInput>({ 
    password: '', 
    confirmPassword: '' 
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // Generic form submission handler
  const handleSubmit = async (
    formData: any,
    schema: z.ZodSchema,
    endpoint: string,
    successCallback: () => void
  ) => {
    setIsLoading(true)
    
    // Validate form
    const result = schema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors(Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]: any) => [key, value?.[0] ?? ''])
      ))
      setIsLoading(false)
      return
    }

    // Clear previous errors
    setErrors({})

    try {
      const response = await clientApi(endpoint, {
        method: 'POST',
        data: JSON.stringify(token ? { ...formData, token } : formData)
      })
      
      if (response.message) {
        successCallback()
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(
      emailForm,
      emailSchema,
      '/auth/forgot-password',
      () => setIsSuccess(true)
    )
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(
      passwordForm,
      passwordSchema,
      '/auth/reset-password',
      () => router.push('/login')
    )
  }

  return (
    <div className="flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative items-center text-center">
        <Image
          src="/login-img.png"
          alt="Password reset"
          className="object-cover m-auto mt-16"
          width={600}
          height={400}
          priority
          quality={80}
        />
        <div className="flex items-center text-center justify-center">
          <div className="text-green-600 p-8 max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              {token ? 'Set New Password' : 'Reset Your Password'}
            </h1>
            <p className="text-lg">
              {token 
                ? 'Enter a new password to secure your account'
                : 'Enter your email to receive a reset link'}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {token ? 'New Password' : 'Forgot Password'}
            </h1>
            <p className="text-gray-600">
              Remembered your password? {' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>

          {/* Error/Success Messages */}
          {errors.form && <Message type="error" message={errors.form} />}
          {isSuccess && !token && <Message type="success" message="Reset link sent to your email" />}
          {isSuccess && token && <Message type="success" message="Password updated successfully!" />}

          {token ? (
            // Password Reset Form
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormInput
                id="password"
                label="New Password"
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                placeholder="Enter new password"
                error={errors.password}
              />
              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                error={errors.confirmPassword}
              />
              <SubmitButton
                isLoading={isLoading}
                label="Reset Password"
                loadingLabel="Resetting..."
              />
            </form>
          ) : (
            // Email Request Form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                placeholder="your@email.com"
                error={errors.email}
              />
              <SubmitButton
                isLoading={isLoading}
                label="Send Reset Link"
                loadingLabel="Sending..."
              />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}