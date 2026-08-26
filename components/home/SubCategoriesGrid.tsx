'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { categoriesUser } from '@/services/categories';
import { useApiGet } from '@/hooks/useApi';
import CategoryCard from '@/components/ui/CategoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StoreCategory, StorePaginatedResponse } from '@/types/store.interface';

export default function SubCategoriesGrid({ categoryId }: { categoryId: number }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useApiGet(categoriesUser.getSubCategories, locale, categoryId, page);
  const response = data as StorePaginatedResponse<StoreCategory> | null;
  const subCategories = response?.data ?? [];
  const totalPages = response?.last_page ?? 1;

  if (isLoading) return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="h-2 w-12 bg-foreground/6 rounded animate-pulse" />
        <div className="h-6 w-36 bg-foreground/8 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-foreground/6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-background aspect-square animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (error || subCategories.length === 0) return null;

  return (
    <div className="flex flex-col gap-6" dir={t('ltr')}>
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-secondary">
          {t('explore')}
        </span>
        <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight">
          {t('subcategories_length_sub_categ')}
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-foreground/6">
        {subCategories.map(sub => (
          <CategoryCard key={sub.id} category={sub} locale={locale} variant="sub" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-foreground/6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-colors duration-200">
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 text-xs font-bold border transition-colors duration-200 ${page === i + 1 ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 text-foreground/40 hover:border-secondary hover:text-secondary'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-foreground/10 text-foreground/50 hover:border-secondary hover:text-secondary disabled:opacity-30 transition-colors duration-200">
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
