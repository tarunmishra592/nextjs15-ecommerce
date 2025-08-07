'use server'
import { cookies } from 'next/headers'

export async function setAuthCookie(token: string) {
  (await cookies()).set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}