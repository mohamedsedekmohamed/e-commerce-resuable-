'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useTranslations } from 'next-intl';
import { StorePaginatedResponse, StoreProduct } from '@/types/store.interface';

export default function AllProductsGrid() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useApiGet(userHome.allProducts, locale, page);
  const response = data as StorePaginatedResponse<StoreProduct> | null;
  const products = response?.data ?? [];
  const lastPage = response?.last_page ?? 1;

  if (isLoading && products.length === 0) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />
      ))}
    </div>
  );

  if (products.length === 0) return (
    <div className="py-20 flex flex-col items-center gap-3 border border-dashed border-border mt-6">
      <span className="text-3xl font-bold text-foreground/8">Rx</span>
      <p className="text-sm font-medium text-foreground/35">
        {t('no_products_found')}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8" dir={t('ltr')}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
      </div>

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-border">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center border border-border text-foreground/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150">
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {Array.from({ length: Math.min(lastPage, 7) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-xs font-semibold border transition-colors duration-150 ${
                page === i + 1
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-foreground/45 hover:border-primary/40 hover:text-primary'
              }`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
            className="w-9 h-9 flex items-center justify-center border border-border text-foreground/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150">
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
