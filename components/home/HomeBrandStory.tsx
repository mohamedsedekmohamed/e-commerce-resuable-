'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { aboutUser } from '@/services/userAbout';
import { useTranslations } from 'next-intl';
import { StoreAbout } from '@/types/store.interface';

export default function HomeBrandStory() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const { data: aboutResponse, isLoading } = useApiGet(aboutUser.getAbout, locale);

  // Normalise — API may return data directly or nested under .data
  const response = aboutResponse as unknown;
  const about = typeof response === 'object' && response !== null && 'data' in response
    ? (response as { data?: StoreAbout }).data ?? null
    : response as StoreAbout | null;

  // ── All hooks unconditional ──
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [about]); // re-attach once about data arrives so ref is live

  // ── Loading: show skeleton so section occupies space ──
  if (isLoading) {
    return (
      <section className="bg-primary border-b border-primary-400 py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="h-2 w-16 bg-white/10" />
              <div className="h-8 w-2/3 bg-white/10" />
              <div className="h-16 w-full bg-white/8" />
              <div className="h-9 w-32 bg-white/10" />
            </div>
            <div className="hidden lg:block h-64 bg-white/6" />
          </div>
        </div>
      </section>
    );
  }

  // ── No content from API at all — render nothing ──
  const hasContent = about?.title || about?.content || about?.image;
  if (!hasContent) return null;

  return (
    <section
      ref={ref}
      className="bg-primary border-b border-primary-400"
      dir={t('ltr')}
    >
      <div className="container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >

          {/* ─── Left: copy ─── */}
          <div className="py-14 lg:py-16 flex flex-col justify-center lg:pe-12 lg:border-e lg:border-white/8">

            <div className="flex items-center gap-2 mb-6">
              <span className="block w-5 h-px bg-secondary shrink-0" />
              <span className="text-[9px] font-semibold tracking-[0.26em] uppercase text-secondary">
                {t('about_us')}
              </span>
            </div>

            {about?.title && (
              <h2
                className="font-bold text-white leading-tight tracking-tight mb-5"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}
              >
                {about.title}
              </h2>
            )}

            {about?.content && (
              <p className="text-sm text-white/55 leading-relaxed max-w-md mb-8">
                {about.content}
              </p>
            )}

            <Link
              href={`/${locale}/about`}
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/70 text-xs font-semibold tracking-widest uppercase hover:border-secondary hover:text-secondary transition-colors duration-200"
            >
              {t('read_more')}
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          {/* ─── Right: image or tonal fill ─── */}
          <div className="hidden lg:flex items-stretch">
            {about?.image ? (
              <div className="relative w-full" style={{ minHeight: '340px' }}>
                <Image
                  src={about.image}
                  alt={about.title || (t('about'))}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-75"
                />
                <div className="absolute inset-0 ph-label-pattern pointer-events-none" />
              </div>
            ) : (
              <div className="w-full bg-primary-400 border-s border-white/6" />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
