'use client'
// src/app/(private)/profile/page.tsx
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { apiFetch } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch<User>('/users/profile')
      .then((data: User) => {
        setUser(data);
      })
      .catch(console.error);
  }, []);

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      {/* Add buttons/forms for change password, add address */}
    </div>
  );
}
