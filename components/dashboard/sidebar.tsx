'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { LogoutButton } from '@/components/logout-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface DashboardSidebarProps {
  user: User;
}

interface UserPermissions {
  hasLifetimeMembership: boolean;
  hasActiveSubscription: boolean;
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
  {
    icon: '📜',
    label: 'Billing',
    href: '/dashboard/billing',
  },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('/api/payment/permissions');
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
    
    // 监听路由变化和自定义事件，刷新权限
    const handleRefresh = () => {
      fetchPermissions();
    };
    
    // 监听自定义事件（购买成功时触发）
    window.addEventListener('permissionsUpdated', handleRefresh);
    
    return () => {
      window.removeEventListener('permissionsUpdated', handleRefresh);
    };
  }, [pathname]); // 依赖pathname，路由变化时重新获取

  const getMembershipStatus = () => {
    if (permissions?.hasLifetimeMembership) return 'Lifetime Pro';
    if (permissions?.hasActiveSubscription) return 'Pro';
    return 'Free';
  };

  const getMembershipBadgeClass = () => {
    if (permissions?.hasLifetimeMembership) {
      return 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 dark:text-yellow-400 border-0';
    }
    if (permissions?.hasActiveSubscription) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0';
  };

  return (
    <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen flex-shrink-0">
      {/* Logo & Membership Status */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            TypeCN
          </span>
        </Link>
        <Badge className={getMembershipBadgeClass()}>
          {getMembershipStatus()}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4 flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </div>
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

