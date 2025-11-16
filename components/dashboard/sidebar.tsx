'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { LogoutButton } from '@/components/logout-button';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface DashboardSidebarProps {
  user: User;
}

const menuItems = [
  {
    icon: '🏠',
    label: 'Home',
    href: '/dashboard',
  },
  {
    icon: '📚',
    label: 'Course Store',
    href: '/dashboard/courses',
  },
  {
    icon: '💎',
    label: 'Membership',
    href: '/dashboard/membership',
  },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            TypeCN
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Free Plan</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4">
          <ThemeSwitcher />
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

