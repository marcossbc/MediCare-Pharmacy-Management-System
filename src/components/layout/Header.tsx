'use client';

import { Menu, LogOut, Bell } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onOpenMobile: () => void;
  title?: string;
  alertCount?: number;
}

export default function Header({ onOpenMobile, title = 'Dashboard', alertCount = 0 }: HeaderProps) {
  const { data: session } = useSession();

  const initials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
          <Bell className="h-[18px] w-[18px]" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        <ThemeToggle />

        <div className="ml-2 flex items-center gap-2 border-l border-gray-100 dark:border-gray-800 pl-3">
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-xs font-semibold text-primary-700 dark:text-primary-300">
            {initials}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950/50"
            title="Sign out"
          >
            <LogOut className="h-[18px] w-[18px]" />Logout
          </button>
        </div>
      </div>
    </header>
  );
}
