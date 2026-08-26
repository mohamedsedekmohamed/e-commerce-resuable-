'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, ImageOff, Sparkles, Star, Hexagon, Circle, Activity, Heart } from 'lucide-react';
import { StoreCategory } from '@/types/store.interface';
import RevealBox from '@/components/shared/RevealBox';

interface HomeCategoriesRowProps {
  categories: StoreCategory[];
  isLoading: boolean;
}

function CatImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err)
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <ImageOff className="w-10 h-10 text-foreground/20" />
      </div>
    );
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
      onError={() => setErr(true)}
    />
  );
}

export default function HomeCategoriesRow({ categories, isLoading }: HomeCategoriesRowProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  /* ── Skeleton ── */
  if (isLoading) {
    return (
      <section className="bg-background py-16 lg:py-24 relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-12 lg:mb-16">
            <div className="h-8 w-32 rounded-full bg-foreground/5 animate-pulse" />
            <div className="h-12 w-64 md:w-96 rounded-lg bg-foreground/5 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full aspect-[4/5] rounded-[2rem] bg-foreground/5 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <RevealBox animation="fade-up" as="section" className="relative overflow-hidden bg-background py-16 lg:py-24" dir={t('ltr')}>
      
      {/* ── Background Floating Icons ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-icon-1 {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(10deg) scale(1.05); }
        }
        @keyframes float-icon-2 {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(30px) rotate(-15deg) scale(0.95); }
        }
        .anim-float-1 { animation: float-icon-1 18s ease-in-out infinite; }
        .anim-float-2 { animation: float-icon-2 22s ease-in-out infinite; }
      `}} />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Heart className="absolute top-[5%] left-[5%] w-32 h-32 text-foreground/[0.03] dark:text-foreground/[0.02] anim-float-1" />
        <Activity className="absolute top-[15%] right-[8%] w-48 h-48 text-foreground/[0.03] dark:text-foreground/[0.02] anim-float-2" style={{ animationDelay: '-3s' }} />
        <Star className="absolute bottom-[20%] left-[10%] w-24 h-24 text-foreground/[0.03] dark:text-foreground/[0.02] anim-float-2" style={{ animationDelay: '-7s' }} />
        <Hexagon className="absolute bottom-[5%] right-[15%] w-40 h-40 text-foreground/[0.03] dark:text-foreground/[0.02] anim-float-1" style={{ animationDelay: '-11s' }} />
        <Circle className="absolute top-[40%] left-[50%] w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 text-foreground/[0.015] dark:text-foreground/[0.01] anim-float-1" style={{ animationDelay: '-15s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-yellow-600 dark:text-yellow-500">
              {t('all_categories')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-yellow-500 leading-[1.1] max-w-2xl drop-shadow-sm">
            {t('shop_by_section')}
          </h2>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((cat, idx) => (
            <RevealBox 
              key={cat.id} 
              animation="fade-up" 
              delay={(idx % 3) * 100}
            >
              <Link
                href={`/${locale}/categories/${cat.id}?name=${encodeURIComponent(cat.name)}`}
                className="group relative flex w-full aspect-[4/5] flex-col overflow-hidden rounded-[2rem] bg-card shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] focus-visible:outline-none ring-1 ring-border/50"
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full">
                  {cat.image ? (
                    <CatImage src={cat.image} alt={cat.name} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <span className="text-6xl font-black text-primary/10 select-none">
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Focus indicator border */}
                <div className="absolute inset-0 rounded-[2rem] border-2 border-primary opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 pointer-events-none" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <h3 className="text-white text-3xl lg:text-4xl font-black tracking-tight mb-3 drop-shadow-md">
                    {cat.name}
                  </h3>
                  
                  {/* Subtle Accent Line */}
                  <div className="w-12 h-1 bg-yellow-400 mb-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
                  
                  <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-bold opacity-0 transition-all duration-500 delay-150 group-hover:opacity-100">
                    <span className="uppercase tracking-wider text- text-[11px]">{t('all_categories')}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>

              </Link>
            </RevealBox>
          ))}
        </div>

        {/* ── View All Button (Bottom Centered) ── */}
        <div className="mt-16 flex justify-center">
          <Link
            href={`/${locale}/categories`}
            className="group inline-flex items-center gap-3 rounded-full bg-yellow-400 text-black px-8 py-4 text-sm font-bold tracking-[0.1em] uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-400/30 focus-visible:outline-none"
          >
            {t('all_categories')}
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:bg-black/20">
              {isRtl
                ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </span>
          </Link>
        </div>

      </div>

      {/* ── Glowing Bottom Divider ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="absolute bottom-0 w-3/4 max-w-3xl h-[6px] bg-yellow-400 blur-[10px] opacity-30" />
        <div className="absolute bottom-0 w-1/2 max-w-lg h-[2px] bg-yellow-400 blur-[3px] opacity-60" />
      </div>

    </RevealBox>
  );
}
