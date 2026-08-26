'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StorePaginatedResponse, StoreProduct } from '@/types/store.interface';

export default function AllProductsClient() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);

  const { data, isLoading } = useApiGet(userHome.allProducts, locale, page);
  const response = data as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(response) ? response : response?.data ?? [];
  const lastPage = Array.isArray(response) ? 1 : response?.last_page ?? 1;

  return (
    <div className="container py-10 pb-20" dir={t('ltr')}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="block w-1 h-5 bg-primary shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary/70">
              {t('browse')}
            </span>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {t('all_products')}
            </h1>
          </div>
        </div>
        {products.length > 0 && (
          <span className="text-xs font-medium text-foreground/35">
            {t('page_page_of_lastpage')}
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 border border-dashed border-border">
          <span className="text-2xl font-bold text-foreground/10">Rx</span>
          <p className="text-sm font-medium text-foreground/30">
            {t('no_products_found')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} locale={locale} />)}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10 pt-8 border-t border-border">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center border border-border text-foreground/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {Array.from({ length: Math.min(lastPage, 7) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 text-xs font-semibold border transition-colors duration-150 ${
                  page === pageNum
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-foreground/45 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage(p => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="w-9 h-9 flex items-center justify-center border border-border text-foreground/50 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
