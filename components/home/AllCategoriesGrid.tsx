'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import { Layers, ArrowUpRight, ArrowUpLeft, Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import RevealBox from '@/components/shared/RevealBox';
import {
  StoreCategory,
  StoreCategoryImage,
  StorePaginatedResponse,
} from '@/types/store.interface';

function getCategoryImageUrl(image: StoreCategoryImage | string): string | undefined {
  if (typeof image === 'string') return image;
  return image.image_path || image.image || image.url;
}

export default function AllCategoriesGrid() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const { data, isLoading, error } = useApiGet(categoriesUser.getParentCategories, locale, 1);

  const responseData = data as StorePaginatedResponse<StoreCategory> | undefined;
  const categories = responseData?.data ?? [];

  /* ── Skeleton ── */
  if (isLoading) return (
    <div className="flex flex-col gap-px bg-foreground/6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-background grid grid-cols-1 md:grid-cols-2 gap-0 animate-pulse">
          <div className="aspect-4/3 bg-foreground/5" />
          <div className="p-10 flex flex-col gap-4">
            <div className="h-3 w-16 bg-foreground/5 rounded" />
            <div className="h-10 w-3/4 bg-foreground/8 rounded" />
            <div className="h-20 w-full bg-foreground/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Empty ── */
  if (error || categories.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <Layers className="w-10 h-10 text-foreground/20" />
      <p className="text-sm font-semibold uppercase tracking-widest text-foreground/35">
        {t('no_companies_found')}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-px bg-foreground/6" dir={t('ltr')}>
      {categories.map((category, index) => {
        const isEven = index % 2 === 0;
        const allImages = [
          category.image,
          ...(category.images ?? []).map(getCategoryImageUrl),
        ].filter((image): image is string => Boolean(image));
        const mainImage = allImages[0];
        const extraImages = allImages.slice(1, 3);
        const companyHref = `/${locale}/companies/${category.id}?name=${encodeURIComponent(category.name)}&desc=${encodeURIComponent(category.description || '')}&img=${encodeURIComponent(category.image || '')}`;

        return (
          <RevealBox
            key={category.id}
            animation="fade-up"
            className={`bg-background grid grid-cols-1 md:grid-cols-2 ${!isEven ? 'md:[direction:rtl]' : ''}`}
          >
            {/* ── Image column ── */}
            <div className={`relative overflow-hidden group cursor-pointer ${!isEven ? 'md:[direction:ltr]' : ''}`}
              onClick={() => router.push(companyHref)}>

              {/* Main image */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-card">
                {mainImage ? (
                  <Image src={mainImage} alt={category.name} fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-foreground/6">
                    {category.name.charAt(0)}
                  </div>
                )}
                {/* Amber bottom line on hover */}
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              </div>

              {/* Extra image strip */}
              {extraImages.length > 0 && (
                <div className={`grid gap-px bg-foreground/6 ${extraImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {extraImages.map((src, i) => (
                    <div key={i} className="relative aspect-4/3 overflow-hidden bg-card">
                      <Image src={src} alt={`${category.name} ${i + 2}`} fill
                        sizes="(max-width:768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Content column ── */}
            <div className={`flex flex-col justify-between p-8 md:p-12 xl:p-16 border-t md:border-t-0 border-foreground/6 ${!isEven ? 'md:[direction:ltr]' : ''}`}>

              <div className="flex flex-col gap-5">
                {/* Index + label */}
                <div className="flex items-center gap-3">
                  <span className="font-black text-foreground/12 tabular-nums select-none" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 max-w-10 bg-foreground/10" />
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-secondary">
                    {t('company')}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-black text-foreground leading-[0.92] tracking-tighter" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                  {category.name}
                </h2>

                {/* Amber rule */}
                <span className="block w-8 h-0.5 bg-secondary" />

                {/* Description */}
                {category.description && (
                  <div>
                    <p className={`text-sm text-foreground/50 leading-relaxed transition-all ${expandedCategories[String(category.id)] || category.description.length <= 160 ? '' : 'line-clamp-3'}`}>
                      {category.description}
                    </p>
                    {category.description.length > 160 && (
                      <button
                        onClick={() => setExpandedCategories(prev => ({
                          ...prev,
                          [String(category.id)]: !prev[String(category.id)],
                        }))}
                        className="mt-2 text-[11px] font-semibold tracking-wide text-secondary hover:opacity-70 transition-opacity"
                      >
                        {expandedCategories[String(category.id)]
                          ? (t('show_less'))
                          : (t('show_more'))}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-foreground/8">
                <Link href={companyHref}
                  className="group inline-flex items-center gap-2.5 px-6 py-3 bg-foreground text-background font-bold text-xs tracking-widest uppercase hover:bg-secondary transition-colors duration-200">
                  {t('view_products')}
                  {isRtl
                    ? <ArrowUpLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    : <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />}
                </Link>

                {category.instagram && (
                  <a href={category.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-foreground/12 text-foreground/40 hover:border-secondary hover:text-secondary transition-colors duration-200"
                    title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </RevealBox>
        );
      })}
    </div>
  );
}
