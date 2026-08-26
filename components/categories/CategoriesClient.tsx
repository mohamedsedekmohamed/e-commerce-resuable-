'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import PageHero from '@/components/ui/PageHero';
import {
  StoreCategory,
  StoreEntityId,
  StorePaginatedResponse,
  StoreProduct,
} from '@/types/store.interface';

function SubCatImg({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-foreground/10 text-foreground/40">
        <ImageIcon className="w-3 h-3" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="32px"
      onError={() => setErr(true)}
    />
  );
}

export default function CategoriesClient() {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [selectedParentId, setSelectedParentId] = useState<StoreEntityId | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<StoreEntityId | null>(null);

  // Fetch Parent Categories
  const { data: parentData, isLoading: parentLoading } = useApiGet(
    userHome.parentCategories,
    locale,
    1
  );
  const parentRes = parentData as StorePaginatedResponse<StoreCategory> | StoreCategory[] | null;
  const parentCategories = Array.isArray(parentRes) ? parentRes : parentRes?.data ?? [];

  useEffect(() => {
    if (!selectedParentId && parentCategories.length > 0) {
      setSelectedParentId(parentCategories[0].id);
    }
  }, [parentCategories, selectedParentId]);

  const currentParentId = selectedParentId ?? (parentCategories.length > 0 ? parentCategories[0].id : null);

  // Fetch Sub Categories for selected parent
  const { data: subData, isLoading: subLoading } = useApiGet(
    userHome.subCategories,
    locale,
    currentParentId ? Number(currentParentId) : 0,
    1
  );
  const subRes = subData as StorePaginatedResponse<StoreCategory> | StoreCategory[] | null;
  const subCategories = Array.isArray(subRes) ? subRes : subRes?.data ?? [];

  const handleParentSelect = (id: StoreEntityId) => {
    setSelectedParentId(id);
    setSelectedSubId(null);
  };

  const activeProductCategoryId = selectedSubId ?? currentParentId;

  // Fetch Products
  const { data: prodData, isLoading: prodLoading } = useApiGet(
    userHome.products,
    locale,
    activeProductCategoryId ? Number(activeProductCategoryId) : 0,
    1
  );
  const prodRes = prodData as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(prodRes) ? prodRes : prodRes?.data ?? [];

  const currentParentName = parentCategories.find(
    (c) => String(c.id) === String(selectedParentId)
  )?.name;

  return (
    <div className="flex flex-col w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Page Hero ── */}
      <PageHero
        title={t('pharmacy_sections')}
        subtitle={t('browse_all_our_sections_medici')}
        label={t('categories')}
      />

      <div className="container py-10 md:py-14 pb-24 flex flex-col gap-10">

        {/* ── Parent Categories ── */}
        <div className="flex flex-col gap-4">
          {/* Section label */}
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-secondary shrink-0" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-foreground/50">
              {t('pharmacy_sections')}
            </span>
          </div>

          {parentLoading ? (
            <div className="flex gap-3 pb-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-32 rounded-2xl bg-foreground/5 animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 -mt-2 px-1 -mx-1 scrollbar-hide">
              {parentCategories.map((cat) => {
                const isSelected = String(selectedParentId) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleParentSelect(cat.id)}
                    className={`shrink-0 px-7 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-300 border ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-[1.02]'
                        : 'bg-card text-foreground/70 border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:-translate-y-0.5 shadow-sm'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sub Categories ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-1 h-4 bg-secondary shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-foreground/50">
                {t('sub_categories')}
              </span>
            </div>
            {subCategories.length > 0 && (
              <span className="text-[11px] font-semibold text-foreground/35">
                {subCategories.length} {t('sub_categories')}
              </span>
            )}
          </div>

          {subLoading ? (
            <div className="flex flex-wrap gap-3 mt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-28 rounded-full bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              {/* All button */}
              <button
                onClick={() => setSelectedSubId(null)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  selectedSubId === null
                    ? 'bg-foreground text-background border-foreground shadow-md'
                    : 'bg-background text-foreground/70 border-border hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>{t('all')}</span>
              </button>

              {/* Sub-category buttons */}
              {subCategories.map((sub) => {
                const isSelected = String(selectedSubId) === String(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                      isSelected
                        ? 'bg-foreground text-background border-foreground shadow-md'
                        : 'bg-background text-foreground/70 border-border hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    {sub.image && (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-background border border-foreground/10 flex items-center justify-center">
                        <SubCatImg src={sub.image} alt={sub.name} />
                      </div>
                    )}
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Products ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1 h-5 bg-primary shrink-0" />
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
                {currentParentName ?? t('products')}
              </h2>
            </div>
            {!prodLoading && products.length > 0 && (
              <span className="text-[11px] font-semibold text-foreground/40">
                {products.length} {t('items')}
              </span>
            )}
          </div>

          {prodLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-2">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-3 border border-dashed border-border">
              <span className="text-5xl font-black text-foreground/6">Rx</span>
              <p className="text-sm font-semibold text-foreground/35">
                {t('no_products_in_this_section_ye')}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
