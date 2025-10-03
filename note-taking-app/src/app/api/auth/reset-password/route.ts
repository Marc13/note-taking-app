import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { resetPasswordSchema } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = resetPasswordSchema.parse(body)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, we sent you a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Store reset token in verification tokens table
    await prisma.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token: resetToken,
        expires: expires,
      },
    })

    // Send reset email
    try {
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${validatedData.email}`
      await sendPasswordResetEmail(validatedData.email, resetUrl)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent you a password reset link.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
