'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { aboutUser } from '@/services/userAbout';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Showservices from '@/components/about/Showservices';
import { Image as ImageIcon, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

function ImgFallback({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-foreground/20">
      <ImageIcon className="w-10 h-10" />
      <span className="text-[10px] font-semibold uppercase tracking-wider">No Image</span>
    </div>
  );
  return <Image src={src} alt={alt} fill className={className} sizes={sizes} onError={() => setErr(true)} />;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="transition-all duration-600" style={{ transitionDelay: `${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(14px)' }}>
      {children}
    </div>
  );
}

const BADGES_EN = [
  '10+ years experience',
  'Market-Focused',
  'Top expertise',
  'Corporate Investors',
  'Integrity & Innovation',
];
const BADGES_AR = [
  '+10 سنوات خبرة',
  'تركيز على السوق',
  'خبرة عالية',
  'مستثمرون مؤسسيون',
  'نزاهة وابتكار',
];

const TRUST_POINTS_EN = [
  'Authentic and verified products',
  'Secure ordering process',
  'Licensed and regulated',
  'Clear return and exchange policy',
];
const TRUST_POINTS_AR = [
  'منتجات أصيلة موثقة',
  'عملية طلب آمنة',
  'مرخصة وخاضعة للتنظيم',
  'سياسة إرجاع واستبدال واضحة',
];

export default function AboutPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { data: aboutResponse, isLoading } = useApiGet(aboutUser.getAbout, locale);
  const about = aboutResponse?.data;

  const badges = isRtl ? BADGES_AR : BADGES_EN;
  const trustPoints = isRtl ? TRUST_POINTS_AR : TRUST_POINTS_EN;

  const heroTitle = about?.title || (isRtl ? 'ارتقِ بأعمالك إلى المستوى التالي معنا.' : 'Elevate your business to the next level with us.');
  const heroSubtitle = about?.content || t('your_trusted_pharmacy_for_all_');

  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col" dir={t('ltr')}>
      <Navbar />

      {/* ══════════════════════════════════════════════════
          HERO — Primary background, Image + Content side by side
          ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-primary">

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        <div className="container relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-16 md:py-20 items-center">
              <div className="aspect-4/3 rounded-2xl bg-black/10 animate-pulse" />
              <div className="flex flex-col gap-5">
                <div className="h-4 w-24 bg-black/10 animate-pulse rounded" />
                <div className="h-12 w-3/4 bg-black/10 animate-pulse rounded" />
                <div className="h-24 w-full bg-black/10 animate-pulse rounded" />
                <div className="flex gap-2.5 flex-wrap">
                  {[1,2,3].map(i => <div key={i} className="h-9 w-28 bg-black/10 animate-pulse rounded" />)}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-16 md:py-20 lg:py-24 items-center">

              {/* ── Image ── */}
              <FadeIn>
                <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
                  {about?.image
                    ? <ImgFallback src={about.image} alt={about?.title || ''} className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                    : <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-2xl">
                        <span className="text-8xl font-black text-white/20">{(about?.title || 'A').charAt(0)}</span>
                      </div>}
                </div>
              </FadeIn>

              {/* ── Content ── */}
              <div className="flex flex-col gap-6">
                
                {/* Label */}
                <FadeIn>
                  <div className="flex items-center gap-3">
                    <span className="block w-10 h-[2px] bg-white/30 shrink-0 rounded-full" />
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/60">
                      {t('our_story')}
                    </span>
                  </div>
                </FadeIn>

                {/* Title */}
                <FadeIn delay={80}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                    {about?.title || (isRtl ? 'ارتقِ بأعمالك إلى المستوى التالي معنا.' : 'Elevate your business to the next level with us.')}
                  </h1>
                </FadeIn>

                {/* Description as paragraphs */}
                <FadeIn delay={140}>
                  <div className="flex flex-col gap-4">
                    {(about?.content || t('your_trusted_pharmacy_for_all_'))
                      .split(/\n+/)
                      .filter((p: string) => p.trim())
                      .map((paragraph: string, i: number) => (
                        <p key={i} className="text-sm md:text-base text-white/80 leading-[1.9] font-medium">
                          {paragraph.trim()}
                        </p>
                      ))
                    }
                  </div>
                </FadeIn>

                {/* Badges */}
                <FadeIn delay={200}>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                    {badges.map((badge, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 text-[11px] font-bold text-white bg-white/[0.12] border border-white/20 rounded-sm tracking-wide transition-colors duration-300 hover:bg-white/[0.2] hover:border-white/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </FadeIn>

                {/* Trust checklist */}
                <FadeIn delay={260}>
                  <ul className="flex flex-col gap-3 mt-2">
                    {trustPoints.map((pt, i) => (
                      <li key={i} className="flex items-center gap-3 group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-white/90">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      <div className="grow">
        {/* ── Services ── */}
        <Showservices />
      </div>

      <Footer />
    </main>
  );
}
