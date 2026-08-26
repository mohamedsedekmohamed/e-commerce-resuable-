'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StoreCategory, StorePaginatedResponse, StoreProduct } from '@/types/store.interface';

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
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="80px"
      onError={() => setErr(true)}
    />
  );
}

interface CategoryContentProps {
  parentCategoryId: number;
}

export default function CategoryContent({ parentCategoryId }: CategoryContentProps) {
  const t = useTranslations('common');
  const locale = useLocale();

  const { data: subData, isLoading: subLoading } = useApiGet(userHome.subCategories, locale, parentCategoryId, 1);
  const subResponse = subData as StorePaginatedResponse<StoreCategory> | StoreCategory[] | null;
  const subCategories = Array.isArray(subResponse) ? subResponse : subResponse?.data ?? [];

  const { data: prodData, isLoading: prodLoading } = useApiGet(userHome.products, locale, parentCategoryId, 1);
  const productResponse = prodData as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(productResponse) ? productResponse : productResponse?.data ?? [];

  return (
    <div className="flex flex-col gap-12" dir={t('ltr')}>

      {/* ── Sub Categories ── */}
      {!subLoading && subCategories.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-1 h-5 bg-primary shrink-0" />
            <h2 className="text-base font-bold text-foreground">
              {t('sub_categories')}
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {subCategories.map(sub => (
              <Link
                key={sub.id}
                href={`/${locale}/categories/${sub.id}?name=${encodeURIComponent(sub.name)}`}
                className="group flex flex-col bg-card border border-border hover:border-primary/35 overflow-hidden transition-colors duration-150"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-background">
                  {sub.image
                    ? <ImgFallback src={sub.image} alt={sub.name} />
                    : <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary/15">{sub.name.charAt(0)}</span>
                      </div>
                  }
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </div>
                <div className="px-2 py-1.5 text-center border-t border-border">
                  <span className="text-[11px] font-medium text-foreground/60 group-hover:text-primary transition-colors line-clamp-1">
                    {sub.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Products ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="block w-1 h-5 bg-primary shrink-0" />
            <h2 className="text-base font-bold text-foreground">
              {t('products')}
            </h2>
          </div>
          {products.length > 0 && (
            <span className="text-xs font-medium text-foreground/35">
              {products.length} {t('items')}
            </span>
          )}
        </div>

        {prodLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
  );
}
