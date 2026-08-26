'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <main
      className="bg-background text-foreground min-h-screen flex flex-col"
      dir={t('ltr')}
    >
      <Navbar />

      <div className="grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-xl text-center ph-fadein">

          {/* ── Big 404 number ── */}
          <div className="relative mb-8 select-none">
            <span
              className="block font-bold text-primary/6 leading-none"
              style={{ fontSize: 'clamp(7rem, 22vw, 14rem)' }}
            >
              404
            </span>
            {/* Accent line under 404 */}
            <span className="absolute bottom-0 inset-x-0 flex justify-center">
              <span className="block w-16 h-0.5 bg-secondary" />
            </span>
          </div>

          {/* ── Label ── */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="block w-6 h-px bg-secondary shrink-0" />
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-secondary">
              {isRtl ? 'خطأ' : 'Error'}
            </span>
            <span className="block w-6 h-px bg-secondary shrink-0" />
          </div>

          {/* ── Title ── */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">
            {t('page_not_found')}
          </h1>

          {/* ── Subtitle ── */}
          <p className="text-sm text-foreground/50 leading-relaxed max-w-md mx-auto mb-10">
            {t('sorry_we_couldn_t_find_the_pag')}
          </p>

          {/* ── CTA ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold hover:bg-primary-400 transition-colors duration-150 ph-btn-primary"
            >
              <Home className="w-4 h-4 shrink-0" />
              {t('back_to_home')}
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium text-foreground/60 hover:border-primary hover:text-primary transition-colors duration-150"
            >
              {isRtl
                ? <ArrowRight className="w-4 h-4 shrink-0" />
                : <ArrowLeft className="w-4 h-4 shrink-0" />
              }
              {isRtl ? 'رجوع' : 'Go Back'}
            </button>
          </div>

          {/* ── Decorative divider ── */}
          <div className="mt-14 pt-8 border-t border-border flex items-center justify-center gap-6">
            {[
              { href: `/${locale}/catalog`,    labelEn: 'Products',   labelAr: 'المنتجات'  },
              { href: `/${locale}/categories`, labelEn: 'Categories', labelAr: 'الأقسام'   },
              { href: `/${locale}/contact`,    labelEn: 'Contact',    labelAr: 'اتصل بنا'  },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-foreground/40 hover:text-primary transition-colors duration-150"
              >
                {isRtl ? link.labelAr : link.labelEn}
              </Link>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
