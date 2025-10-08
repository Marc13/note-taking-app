import { PrismaClient } from '@prisma/client'

// Prevent Prisma Client from being used on the client side
if (typeof window !== 'undefined') {
  throw new Error(
    'Prisma Client cannot be used on the client side. Import this file only in Server Components, API routes, or Server Actions.'
  )
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

