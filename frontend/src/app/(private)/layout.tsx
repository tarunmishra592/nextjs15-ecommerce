// src/app/(private)/layout.tsx
import { ReactNode } from 'react';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
