'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StorePaginatedResponse, StoreProduct } from '@/types/store.interface';

export default function ProductsCarousel() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useApiGet(userHome.allProducts, locale, page);
  const response = data as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(response) ? response : response?.data ?? [];
  const lastPage = Array.isArray(response) ? 1 : response?.last_page ?? 1;

  if (isLoading && products.length === 0) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] rounded-2xl bg-foreground/5 animate-pulse" />
      ))}
    </div>
  );

  if (products.length === 0) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4 rounded-3xl bg-card border border-dashed border-border/60">
      <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
        <span className="text-3xl font-black text-foreground/20">Rx</span>
      </div>
      <p className="text-base font-semibold text-foreground/40">
        {t('no_products_found')}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10" dir={t('ltr')}>

      {/* Grid — 4 cols desktop, 3 tablet, 2 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-border/50">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/80 text-foreground/50 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border/80 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: Math.min(lastPage, 7) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                  page === i + 1
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : 'bg-card border border-border/60 text-foreground/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/80 text-foreground/50 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border/80 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
