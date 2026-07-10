'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  FileBarChart,
  Boxes,
  Users,
  Cross,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
  { href: '/products', label: 'Products', icon: Pill, roles: ['admin', 'employee'] },
  { href: '/sales', label: 'Sales', icon: ShoppingCart, roles: ['admin', 'employee'] },
  { href: '/inventory', label: 'Inventory', icon: Boxes, roles: ['admin', 'employee'] },
  { href: '/reports', label: 'Reports', icon: FileBarChart, roles: ['admin', 'employee'] },
  { href: '/users', label: 'Users', icon: Users, roles: ['admin'] },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role ?? 'employee';

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Cross className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-800 dark:text-gray-100">
              ILEYSCARE
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">Pharmacy System</p>
          </div>
        </Link>
        <button
          onClick={onCloseMobile}
          className="lg:hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/60'
                )}
              >
                <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
      </nav>

    
      <div className="border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between rounded-xl bg-gray-50/50 dark:bg-gray-800/30 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar Circle */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950 text-sm font-semibold text-primary-700 dark:text-primary-300">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
          
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {session?.user?.name || 'User Name'}
              </p>
              <span className="inline-block rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 px-1.5 py-0.5 text-[10px] font-medium capitalize text-gray-500 dark:text-gray-400 shadow-sm">
                {role}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign Out"
            className="rounded-lg p-2 text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 shadow-sm hover:shadow transition-all group"
          >
            <LogOut className="h-4.5 w-4.5 h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        {content}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-2xl animate-fade-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}