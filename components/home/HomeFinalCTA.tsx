'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, HeartPulse, Pill, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import RevealBox from '@/components/shared/RevealBox';
import { motion } from 'framer-motion'; // تأكد من تثبيت framer-motion

export default function HomeFinalCTA() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // إعدادات الحركة المستمرة للأيقونات العائمة
  const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <section
      className="relative isolate overflow-hidden border-t border-border bg-[#f8f8f7] py-20 md:py-32"
      dir={t('ltr')}
    >
      {/* ── خلفية القسم (توهج متحرك) ── */}
      <motion.div 
        animate={pulseAnimation}
        className="pointer-events-none absolute -top-28 end-0 h-96 w-96 rounded-full bg-secondary/10 blur-[100px]" 
      />
      <motion.div 
        animate={pulseAnimation}
        transition={{ delay: 2 }} // تأخير لتكوين حركة متبادلة
        className="pointer-events-none absolute bottom-0 start-10 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" 
      />

      <div className="container relative z-10">
        <RevealBox
          animation="zoom-in"
          className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_80px_-20px_rgba(var(--color-primary),0.4)]"
        >
          {/* ── الخلفية المتدرجة للكارت ── */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#1a2b3c]" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />

          {/* ── الأيقونات العائمة (Floating Elements) ── */}
          <motion.div animate={floatingAnimation} className="absolute top-10 end-10 text-white/10 hidden md:block">
            <HeartPulse size={120} strokeWidth={1} />
          </motion.div>
          <motion.div animate={{ ...floatingAnimation, y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -bottom-10 start-20 text-white/5 hidden md:block">
            <Pill size={160} strokeWidth={1} className="rotate-45" />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
            <Activity size={300} strokeWidth={0.5} className="text-secondary/20" />
          </motion.div>

          {/* ── محتوى الكارت ── */}
          <div className="relative z-20 px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
            
            {/* النصوص */}
            <div className="flex w-full md:max-w-2xl flex-col gap-6 text-center md:text-start">
              
              {/* شارة (Badge) متحركة */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="mx-auto md:mx-0 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md shadow-lg"
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary"></span>
                </div>
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-secondary" />
                  {t('ready_to_shop')}
                </span>
              </motion.div>

              <h2 className="font-black leading-[1.15] tracking-tight text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                {t('browse_our_health_products')}
              </h2>
              
              <p className="text-base sm:text-lg leading-relaxed text-white/70 max-w-xl mx-auto md:mx-0 font-medium">
                {t('medicines_supplements_and_pers')}
              </p>
              
              {/* أيقونات المزايا */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-2 text-white/60 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-secondary" />
                  <span>{isRtl ? 'منتجات أصلية' : 'Authentic Products'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pill size={18} className="text-secondary" />
                  <span>{isRtl ? 'تشكيلة واسعة' : 'Wide Variety'}</span>
                </div>
              </div>
            </div>

            {/* الأزرار (Actions) */}
            <div className="flex w-full md:w-auto flex-col sm:flex-row md:flex-col gap-4 shrink-0">
              <Link
                href={`/${locale}/catalog`}
                className="group relative flex min-h-[3.5rem] items-center justify-center gap-3 rounded-full bg-secondary px-8 py-4 text-[15px] font-bold text-foreground overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--color-secondary),0.5)]"
              >
                {/* تأثير لمعان داخل الزر */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                
                <span className="relative z-10">{t('browse_products')}</span>
                {isRtl ? (
                  <ArrowLeft className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
                ) : (
                  <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                )}
              </Link>

              <Link
                href={`/${locale}/categories`}
                className="group flex min-h-[3.5rem] items-center justify-center gap-2 rounded-full border-2 border-white/10 bg-white/5 px-8 py-4 text-[15px] font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105 backdrop-blur-sm"
              >
                {t('categories')}
              </Link>
            </div>
          </div>
        </RevealBox>
      </div>
    </section>
  );
}