'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion'; // تم إضافة Framer Motion
import UITranslateBtn from '@/components/ui/UITranslateBtn';
import { useCartStore } from '@/store/useCartStore';
import { authService, AuthUser } from '@/services/auth';
import { useSettings } from '@/hooks/useSettings';
import logo1 from '@/assets/images/logoone.jpg';
import logo2 from '@/assets/images/logotwo.jpg';

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === 'ar';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const cartCount = useCartStore(s => s.cartCount);
  const fetchCart = useCartStore(s => s.fetchCart);

  const { logoUrl, logoUrl2, brandName, isLoading } = useSettings();

  useEffect(() => {
    setMounted(true);
    setUser(authService.getUser('user'));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted && locale) {
      fetchCart(locale);
    }
  }, [locale, mounted, fetchCart]);

  const navLinks = [
    { name: isRtl ? 'الرئيسية' : 'Home', href: `/${locale}` },
    { name: isRtl ? 'من نحن' : 'About', href: `/${locale}/about` },
    { name: isRtl ? 'الأقسام' : 'Categories', href: `/${locale}/categories` },
    { name: isRtl ? 'المنتجات' : 'Products', href: `/${locale}/catalog` },
    { name: isRtl ? 'اتصل بنا' : 'Contact', href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => {
    const p = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
    const h = href.replace(new RegExp(`^/${locale}`), '') || '/';
    return p === h || (h !== '/' && p.startsWith(h + '/'));
  };

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-t-2 border-secondary ${
        scrolled
          ? 'bg-[#0a0a0a]/85 backdrop-blur-lg shadow-2xl border-b border-white/5'
          : 'bg-[#0d0d0d] border-b border-white/10'
      }`}
    >
      <nav>
        <div className="w-full px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4 w-full h-[84px]">
            {/* ── Logo 1 ── */}
            <Link href={`/${locale}`} className="shrink-0 flex items-center gap-3 py-1 group">
              {isLoading ? (
                <div className="w-14 h-14 bg-white/10 animate-pulse rounded-xl" />
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {logo1 && (
                    <Image
                      src={logo1}
                      alt={brandName || 'Logo 1'}
                      width={120}
                      height={120}
                      className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover rounded-xl shadow-lg shrink-0 bg-white"
                    />
                  )}
                  {!logoUrl && !logoUrl2 && !brandName && !logo1 && (
                    <span className="font-extrabold text-lg md:text-xl tracking-tight text-white group-hover:text-secondary transition-colors">
                      Pharmacy
                    </span>
                  )}
                </motion.div>
              )}
            </Link>

            {/* ── Desktop nav links ── */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group py-2 text-[15px] font-medium transition-colors"
                  >
                    <span className={active ? 'text-white' : 'text-white/60 group-hover:text-white'}>
                      {link.name}
                    </span>
                    {/* Animated Underline */}
                    <span
                      className={`absolute bottom-0 h-[2px] bg-secondary transition-all duration-300 ease-out ${
                        active ? 'w-full' : 'w-0 group-hover:w-full'
                      } ${isRtl ? 'right-0' : 'left-0'}`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ── Right side actions & Logo 2 ── */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <div className="flex items-center gap-3">
                {/* Desktop Auth Links */}
                <div className="hidden lg:flex items-center gap-3 border-e border-white/10 pe-5 me-2">
                  {mounted && user ? (
                    <Link
                      href={`/${locale}/account/orders`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-secondary hover:bg-secondary/10 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center shrink-0 text-secondary group-hover:scale-105 transition-transform">
                        {user.image_url ? (
                          <Image src={user.image_url} alt={user.name} width={32} height={32} className="object-cover" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-white/90 max-w-[100px] truncate group-hover:text-white">
                        {user.name.split(' ')[0]}
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={`/${locale}/auth/login`}
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                      >
                        {isRtl ? 'دخول' : 'Login'}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        className="px-5 py-2 text-sm font-bold bg-secondary text-black rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(var(--secondary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      >
                        {isRtl ? 'حساب جديد' : 'Sign Up'}
                      </Link>
                    </>
                  )}
                </div>

                <div className="hidden lg:block">
                  <UITranslateBtn />
                </div>

                {/* Cart icon */}
                <Link
                  href={`/${locale}/cart`}
                  className="relative flex w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-secondary hover:border-secondary hover:text-black transition-all duration-300"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {mounted && cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* Mobile Account */}
                <Link
                  href={!mounted || !user ? `/${locale}/auth/login` : `/${locale}/account/orders`}
                  className="lg:hidden flex w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-secondary hover:border-secondary hover:text-black transition-all duration-300"
                >
                  {mounted && user?.image_url ? (
                    <Image src={user.image_url} alt={user.name} width={40} height={40} className="object-cover rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </Link>

                {/* Mobile Translate */}
                <div className="md:hidden">
                  <UITranslateBtn />
                </div>

                {/* Hamburger */}
                <button
                  onClick={() => setOpen(!open)}
                  className="lg:hidden flex w-10 h-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {open ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* ── Logo 2 ── */}
              {logo2 && (
                <Link href={`/${locale}`} className="shrink-0 hidden sm:flex items-center group">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Image
                      src={logo2}
                      alt={`${brandName || 'Pharmacy'} Logo 2`}
                      width={120}
                      height={120}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-xl shadow-lg shrink-0 bg-white"
                    />
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile menu (Animated with Framer Motion) ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 flex flex-col gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: isRtl ? 20 : -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                          active
                            ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-[15px]">{link.name}</span>
                        {active && <motion.span layoutId="activeDot" className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary-color)]" />}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-5 mt-3 border-t border-white/10"
                >
                  {mounted && user ? (
                    <Link
                      href={`/${locale}/account/orders`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                        {user.image_url ? (
                          <Image src={user.image_url} alt={user.name} width={40} height={40} className="object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{user.name}</span>
                        <span className="text-xs text-white/50">{isRtl ? 'عرض حسابك' : 'View your account'}</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={`/${locale}/auth/login`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors"
                      >
                        {isRtl ? 'تسجيل الدخول' : 'Sign In'}
                      </Link>
                      <Link
                        href={`/${locale}/auth/register`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl bg-secondary text-black hover:bg-white transition-colors shadow-lg"
                      >
                        {isRtl ? 'حساب جديد' : 'Create Account'}
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}