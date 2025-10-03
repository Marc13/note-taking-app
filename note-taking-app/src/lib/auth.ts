import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: emailSchema,
  password: passwordSchema,
})

// User login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Password reset schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

// New password schema
export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Validation helpers
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Auth error messages
export const authErrors = {
  invalidCredentials: 'Invalid email or password',
  userNotFound: 'No account found with this email address',
  emailNotVerified: 'Please verify your email address before signing in',
  accountExists: 'An account with this email already exists',
  weakPassword: 'Password is too weak',
  networkError: 'Network error. Please try again.',
  serverError: 'Something went wrong. Please try again.',
} as const

export type AuthError = typeof authErrors[keyof typeof authErrors]
