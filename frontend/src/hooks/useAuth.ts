// hooks/useAuth.ts
'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function useAuth() {
  const { user } = useSelector((state: RootState) => state.auth)
  return { isAuthenticated: !!user, user }
}