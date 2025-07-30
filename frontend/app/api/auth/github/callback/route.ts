// /app/api/auth/github/callback/route.ts
import { NextResponse } from 'next/server'
import  db  from '@/lib/db/prisma' // Your Prisma client
import {  currentUser } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect('/?error=missing_code')
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',  },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    }),
  })
  
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  const user =await currentUser()
  if (!user?.emailAddresses[0].emailAddress ) return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL +'/sign-in')

  const res = await db.user.update({
    where: { email: user.emailAddresses[0].emailAddress  },
    data: { githubUrl: accessToken },
  })
  return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL +'/dashboard') 
}
