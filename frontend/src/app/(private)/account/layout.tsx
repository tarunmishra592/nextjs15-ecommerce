// app/account/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const menuItems = [
    { name: 'Profile', path: '/account' },
    { name: 'Orders', path: '/account/orders' },
    { name: 'Change Password', path: '/account/password' },
  ];

  return (
    <div className="container flex m-auto min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white border-r">
        <h2 className="text-xl font-bold mb-6">My Account</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}