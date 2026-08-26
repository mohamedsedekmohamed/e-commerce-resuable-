'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { Image as ImageIcon } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { useTranslations } from 'next-intl';
import {
  StoreCategory,
  StoreEntityId,
  StorePaginatedResponse,
  StoreProduct,
} from '@/types/store.interface';

function ImgFallback({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ImageIcon className="w-5 h-5 text-foreground/20" />
    </div>
  );
  return (
    <Image
      src={src} alt={alt} fill
      className="object-cover transition-transform duration-300"
      sizes="40px"
      onError={() => setErr(true)}
    />
  );
}

export default function CategoryDetailsClient({ categoryId }: { categoryId: number }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categoryName = searchParams.get('name') || '';

  const [selectedSubId, setSelectedSubId] = useState<StoreEntityId | null>(null);

  const { data: subData, isLoading: subLoading } = useApiGet(userHome.subCategories, locale, categoryId, 1);
  const subResponse = subData as StorePaginatedResponse<StoreCategory> | StoreCategory[] | null;
  const subCategories = Array.isArray(subResponse) ? subResponse : subResponse?.data ?? [];

  const activeCategoryId = selectedSubId ?? categoryId;

  const { data: prodData, isLoading: prodLoading } = useApiGet(
    userHome.products,
    locale,
    Number(activeCategoryId),
    1
  );
  const productResponse = prodData as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(productResponse) ? productResponse : productResponse?.data ?? [];

  return (
    <div className="flex flex-col w-full" dir={t('ltr')}>

      {/* Page hero */}
      <PageHero
        title={categoryName || (t('category'))}
        subtitle={t('browse_sub_categories_and_avai')}
        label={t('category')}
      />

      <div className="container py-10 pb-20 flex flex-col gap-12">

        {/* ── Sub Categories Filters ── */}
        {!subLoading && subCategories.length > 0 && (
          <div>
            <div className="flex flex-col gap-4 mb-2 pb-6">
              <div className="flex items-center gap-3">
                <span className="block w-1 h-5 bg-primary shrink-0" />
                <h2 className="text-base font-bold text-foreground">
                  {t('sub_categories')}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* "All" button */}
                <button
                  onClick={() => setSelectedSubId(null)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold transition-all duration-200 border ${
                    selectedSubId === null
                      ? 'bg-secondary text-foreground border-secondary shadow-md scale-[1.02]'
                      : 'bg-card text-foreground/80 border-border hover:border-secondary hover:text-foreground'
                  }`}
                >
                  <span>{t('all')}</span>
                </button>

                {subCategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-bold transition-all duration-200 border ${
                      selectedSubId === sub.id
                        ? 'bg-secondary text-foreground border-secondary shadow-md scale-[1.02]'
                        : 'bg-card text-foreground/80 border-border hover:border-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-background border border-black/10">
                      <ImgFallback src={sub.image || ''} alt={sub.name} />
                    </div>
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="block w-1 h-5 bg-primary shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-primary/70">
                  {t('products')}
                </span>
                <h2 className="text-base font-bold text-foreground">
                  {categoryName || (t('products'))}
                </h2>
              </div>
            </div>
            {products.length > 0 && (
              <span className="text-xs font-medium text-foreground/35">
                {products.length} {t('items')}
              </span>
            )}
          </div>

          {prodLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map(p => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center gap-3 border border-dashed border-border">
              <span className="text-3xl font-bold text-foreground/8">Rx</span>
              <p className="text-sm font-medium text-foreground/35">
                {t('no_products_in_this_section_ye')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
