'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Tag,
  MapPin,
  Map,
  CreditCard,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Flag,
  X,
  LogOut,
  Settings,
  ShoppingBag,
  LucideIcon,
  Info,
  MessageSquare,
  Briefcase,
  Globe,
} from 'lucide-react';
import { useTransition, useState } from 'react';
import ROUTES from '@/core/manager/route.manager';
import { authService } from '@/services/auth';
import Image from 'next/image';
const mainNav = [
  { labelKey: 'dashboard', icon: LayoutDashboard, href: ROUTES.dashboard.overview, section: 'main' },
  { labelKey: 'admins', icon: ShieldCheck, href: ROUTES.dashboard.admin, section: 'people' },
  { labelKey: 'users', icon: Users, href: ROUTES.dashboard.users, section: 'people' },
  { labelKey: 'categories', icon: Tag, href: ROUTES.dashboard.categories, section: 'catalog' },
  { labelKey: 'products', icon: ShoppingBag, href: ROUTES.dashboard.products, section: 'catalog' },
  { labelKey: 'orders', icon: Briefcase, href: ROUTES.dashboard.orders, section: 'catalog' },
  { labelKey: 'coupons', icon: Flag, href: ROUTES.dashboard.coupons, section: 'finance' },
  { labelKey: 'cities', icon: MapPin, href: ROUTES.dashboard.cities, section: 'locations' },
  { labelKey: 'zones', icon: Map, href: ROUTES.dashboard.zones, section: 'locations' },
  { labelKey: 'paymentMethods', icon: CreditCard, href: ROUTES.dashboard.paymentMethods, section: 'finance' },
  { labelKey: 'services', icon: Briefcase, href: ROUTES.dashboard.Service, section: 'content' },
  { labelKey: 'aboutUs', icon: Info, href: ROUTES.dashboard.About, section: 'content' },
  { labelKey: 'contactUs', icon: MessageSquare, href: ROUTES.dashboard.Contact, section: 'content' },
  { labelKey: 'settings', icon: Settings, href: ROUTES.dashboard.Settings, section: 'system' },
];

// ─── 1️⃣ المكونات الفرعية المستقلة (خارج الـ Render تماماً) ──────────────────────

interface NavLinkProps {
  label: string;
  icon: LucideIcon;
  href: string;
  locale: string;
  pathname: string;
  collapsed: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const NavLink = ({ label, icon: Icon, href, locale, pathname, collapsed, setMobileOpen }: NavLinkProps) => {
  const isActive = (href: string) => {
    if (!pathname) return false;

    const withLocale = `/${locale}${href}`;
    const withoutLocale = href;

    if (href === ROUTES.dashboard.overview) {
      return pathname === withLocale || pathname === withoutLocale || pathname === `/${locale}/dashboard` || pathname === '/dashboard';
    }

    return (
      pathname === withLocale ||
      pathname === withoutLocale ||
      pathname.includes(withLocale + '/') ||
      pathname.includes(withoutLocale + '/')
    );
  };

  const active = isActive(href);

  return (
    <Link
      href={`/${locale}${href}`}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
        ${active
          ? 'bg-primary text-white shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon
        className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`}
        strokeWidth={1.75}
      />
      {!collapsed && <span className="flex-1 text-start">{label}</span>}
      {!collapsed && active && (
        <ChevronRight className="w-3.5 h-3.5 opacity-60 transition-transform ltr:block rtl:hidden" />
      )}
      {!collapsed && active && (
        <ChevronRight className="w-3.5 h-3.5 opacity-60 transition-transform hidden rtl:block rotate-180" />
      )}
    </Link>
  );
};

// ─── 2️⃣ مكون محتوى السايدبار الداخلي (مستقل) ───────────────────────────────────

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  locale: string;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}

const SidebarContent = ({ collapsed, setCollapsed, locale, setMobileOpen, pathname }: SidebarContentProps) => {
  const router = useRouter();
  const logoUrl = null;
  const t = useTranslations('admin.sidebar');
  const [, startTransition] = useTransition();

  const changeLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)(\/|$)/, '/');
    const newPath = `/${nextLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Logo + Collapse btn ── */}
      <div className={`flex items-center h-16 px-4 border-b border-border shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer" onClick={() => router.push(`/${locale}`)}>
          {logoUrl ? (
          <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-2'}`}>
            <Image 
              src={logoUrl} 
              alt="Logo" 
              width={collapsed ? 24 : 32}
              height={collapsed ? 24 : 32} 
              className="object-contain shrink-0" 
            />
          </div>
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold uppercase">C</span>
            </div>
          )}
          {!collapsed && !logoUrl && (
            <span className="font-bold text-foreground truncate">
              {t('adminPanel')}
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4 rtl:rotate-180" /> : <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
        {mainNav.map((item) => (
          <NavLink key={item.href} label={t(item.labelKey)} icon={item.icon} href={item.href} locale={locale} pathname={pathname} collapsed={collapsed} setMobileOpen={setMobileOpen} />
        ))}

      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-border px-2 py-3 space-y-0.5">
        
        <button
          onClick={changeLanguage}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (locale === 'en' ? 'العربية' : 'English') : undefined}
        >
          <Globe className="w-[18px] h-[18px] shrink-0 text-muted-foreground group-hover:text-foreground" strokeWidth={1.75} />
          {!collapsed && <span className="text-start">{locale === 'en' ? 'العربية' : 'English'}</span>}
        </button>

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? t('logOut') : undefined}
          onClick={() => {
            authService.clearSession();
            router.push(`/${locale}/auth/admin-login`);
          }}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="text-start">{t('logOut')}</span>}
        </button>
      </div>
    </div>
  );
};

// ─── 3️⃣ المكون الأساسي المصدّر (Sidebar) ───────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sharedProps = { collapsed, setCollapsed, locale, setMobileOpen, pathname };

  return (
    <>
      {/* ── Mobile toggle btn ── */}
      <button
        className="md:hidden fixed top-4 start-4 z-50 w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-sm cursor-pointer"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar ── */}
      <aside
        className={`md:hidden fixed inset-y-0 start-0 z-40 w-64 bg-card border-r border-border shadow-xl transform transition-transform duration-300 pt-16
          ${mobileOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-e border-border transition-all duration-300 shrink-0
          ${collapsed ? 'w-[68px]' : 'w-60'}`}
      >
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  );
}
