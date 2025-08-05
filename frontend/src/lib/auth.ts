import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getToken = async(): Promise<string | null> => {
  const cookieData = await cookies()
  const tokenCookie = cookieData.get('token')
  return tokenCookie?.value ?? null;
};

export const requireAuth = (redirectTo = '/login') => {
  const token = getToken();
  if (!token) {
    redirect(`${redirectTo}?next=${encodeURIComponent(
      (typeof window !== 'undefined' ? window.location.pathname : '')
    )}`);
  }
};
