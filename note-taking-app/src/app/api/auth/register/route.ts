import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { hashPassword, registerSchema } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        emailVerified: null, // Will be set when email is verified
      },
    })

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${user.id}&email=${user.email}`
      await sendVerificationEmail(user.email, verificationUrl)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        userId: user.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)

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
