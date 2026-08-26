'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, LogOut, User } from 'lucide-react';
import { authService } from '@/services/auth';

export default function UserSidebar() {
  const t = useTranslations('user_dashboard');
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const links = [
    { href: `/${locale}/account/orders`, rawHref: '/account/orders', label: t('orders'), icon: ShoppingBag },
    { href: `/${locale}/account/profile`, rawHref: '/account/profile', label: t('profile'), icon: User },
  ];

  const handleLogout = () => {
    authService.clearSession();
    router.replace(`/${locale}/auth/login`);
    router.refresh();
  };

  const isLinkActive = (href: string, rawHref: string) => {
    if (!pathname) return false;
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname === rawHref ||
      pathname.startsWith(`${rawHref}/`)
    );
  };

  return (
    <aside className="w-full bg-card border border-border/60 shadow-sm flex flex-col rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <h2 className="text-base font-bold text-foreground capitalize tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
          {t('my_account')}
        </h2>
      </div>
      
      <nav className="p-3 flex flex-col gap-1.5">
        {links.map((link) => {
          const isActive = isLinkActive(link.href, link.rawHref);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/60 mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl w-full transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}

