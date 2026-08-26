'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { userHome } from '@/services/userHome';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { StoreFooterSettings } from '@/types/store.interface';
import logo1 from '@/assets/images/logoone.jpg';
import logo2 from '@/assets/images/logotwo.jpg';

const NAV_LINKS = [
  { href: '',            labelAr: 'الرئيسية',   labelEn: 'Home'       },
  { href: '/about',      labelAr: 'من نحن',     labelEn: 'About Us'   },
  { href: '/categories', labelAr: 'الأقسام',    labelEn: 'Categories' },
  { href: '/catalog',    labelAr: 'المنتجات',   labelEn: 'Products'   },
  { href: '/contact',    labelAr: 'اتصل بنا',   labelEn: 'Contact'    },
];

export default function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { data: response, isLoading } = useApiGet(userHome.getFooter, locale);
  const d = (response as { data?: StoreFooterSettings } | null)?.data;

  let brandName = 'Pharmacy';
  if (d?.brand_name) {
    brandName = typeof d.brand_name === 'string'
      ? d.brand_name
      : (d.brand_name[locale] || d.brand_name['en'] || 'Pharmacy');
  }

  if (isLoading) return (
    <footer className="bg-foreground border-t border-white/6 pt-12 pb-8 mt-auto">
      <div className="container animate-pulse">
        <div className="h-36 bg-white/5" />
      </div>
    </footer>
  );

  return (
    <footer className="bg-foreground mt-auto" dir={t('ltr')}>

      <div className="container">

        {/* ══ Main grid — 2 cols on mobile (brand top, pages & contact side-by-side), 3 cols on desktop ══ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 pt-12 pb-10 border-b border-white/8">

          {/* Brand column ── */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">

            {/* ── Static Logos (same as Navbar) ── */}
            <Link href={`/${locale}`} className="inline-flex items-center gap-4">
              {logo1 && (
                <Image
                  src={logo1}
                  alt={brandName + ' Logo 1'}
                  width={120}
                  height={120}
                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl shadow-lg bg-white"
                />
              )}
              {logo2 && (
                <Image
                  src={logo2}
                  alt={brandName + ' Logo 2'}
                  width={120}
                  height={120}
                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl shadow-lg bg-white"
                />
              )}
            </Link>

            {/* App links — only if API provides them ── */}
            {(d?.ios_app || d?.android_app) && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-secondary">
                  {t('download_app')}
                </span>
                <div className="flex gap-3 flex-wrap">
                  {d.ios_app && (
                    <a
                      href={d.ios_app}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-50 hover:opacity-80 transition-opacity"
                    >
                      <Image src="/images/app-store.svg" alt="App Store" width={88} height={28} className="h-7 w-auto" />
                    </a>
                  )}
                  {d.android_app && (
                    <a
                      href={d.android_app}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-50 hover:opacity-80 transition-opacity"
                    >
                      <Image src="/images/google-play.svg" alt="Google Play" width={96} height={28} className="h-7 w-auto" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation column ── */}
          <div className="col-span-1 flex flex-col gap-4">
            <span className="text-[9px] font-semibold tracking-[0.26em] uppercase text-white/30">
              {t('pages')}
            </span>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <li key={i}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="flex items-center gap-2 text-sm text-white/35 hover:text-white transition-colors duration-150 group"
                  >
                    <span className="ph-footer-link-line" />
                    {isRtl ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column — only real API data ── */}
          <div className="col-span-1 flex flex-col gap-4">
            <span className="text-[9px] font-semibold tracking-[0.26em] uppercase text-white/30">
              {t('contact')}
            </span>
            <ul className="flex flex-col gap-3.5">
              {d?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                  {d?.map
                    ? (
                      <a
                        href={d.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/35 hover:text-white transition-colors leading-relaxed"
                      >
                        {d.address}
                      </a>
                    )
                    : (
                      <span className="text-sm text-white/35 leading-relaxed">{d.address}</span>
                    )}
                </li>
              )}
              {d?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <a
                    href={`tel:${d.phone}`}
                    className="text-sm text-white/35 hover:text-white transition-colors"
                    dir="ltr"
                  >
                    {d.phone}
                  </a>
                </li>
              )}
              {d?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <a
                    href={`mailto:${d.email}`}
                    className="text-sm text-white/35 hover:text-white transition-colors break-all"
                  >
                    {d.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/20 font-medium">
            © {new Date().getFullYear()} {brandName}.{' '}
            {t('all_rights_reserved')}
          </p>

          {/* Socials — small, tight ── */}
          <div className="flex items-center gap-1.5">
            {d?.wattsapp && (
              <a
                href={`https://wa.me/${d.wattsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-7 h-7 flex items-center justify-center border border-white/8 text-white/25 hover:border-secondary/50 hover:text-secondary transition-colors duration-150"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            )}
            {d?.facebook && (
              <a
                href={d.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 flex items-center justify-center border border-white/8 text-white/25 hover:border-secondary/50 hover:text-secondary transition-colors duration-150"
              >
                <Facebook className="w-3 h-3" />
              </a>
            )}
            {d?.insta && (
              <a
                href={d.insta}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 flex items-center justify-center border border-white/8 text-white/25 hover:border-secondary/50 hover:text-secondary transition-colors duration-150"
              >
                <Instagram className="w-3 h-3" />
              </a>
            )}
            {d?.tiktok && (
              <a
                href={d.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-7 h-7 flex items-center justify-center border border-white/8 text-white/25 hover:border-secondary/50 hover:text-secondary transition-colors duration-150"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            )}
          </div>

          <a
            href="https://codixiatech.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-semibold tracking-[0.14em] uppercase text-white/15 hover:text-secondary transition-colors duration-150"
          >
            {t('powered_by_codixia')}
          </a>
        </div>
      </div>
    </footer>
  );
}
