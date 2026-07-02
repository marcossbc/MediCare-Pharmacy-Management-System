'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/sales': 'Sales',
  '/inventory': 'Inventory',
  '/reports': 'Reports',
  '/users': 'User Management',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const matchedTitle =
    Object.keys(titles).find((key) => pathname?.startsWith(key)) ?? '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Header onOpenMobile={() => setMobileOpen(true)} title={titles[matchedTitle]} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
