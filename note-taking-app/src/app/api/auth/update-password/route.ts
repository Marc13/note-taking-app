import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { hashPassword, newPasswordSchema } from '@/lib/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { token, email, password } = z.object({
      token: z.string(),
      email: z.string().email(),
      password: newPasswordSchema.shape.password,
    }).parse(body)
    
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: token,
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      )
    }

    // Check if email matches
    if (verificationToken.identifier !== email) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password update error:', error)

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
