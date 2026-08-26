'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import Showservices from '@/components/about/Showservices';

import HomeHero from './HomeHero';
import HomeCategoriesRow from './HomeCategoriesRow';
import CategoryProductsSection from './CategoryProductsSection';
import HomeBrandStory from './HomeBrandStory';
import HomeFinalCTA from './HomeFinalCTA';
import { StoreCategory, StorePaginatedResponse } from '@/types/store.interface';

export default function HomePageContent() {
  const locale = useLocale();

  const { data: catsData, isLoading: loadingCats, error: errorCats } = useApiGet(
    userHome.parentCategories,
    locale,
    1
  );

  const response = catsData as StorePaginatedResponse<StoreCategory> | StoreCategory[] | null;
  const categories = Array.isArray(response) ? response : response?.data ?? [];

  if (errorCats) {
    return (
      <section className="bg-background px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-md border border-red-500/20 bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 h-1 w-10 bg-red-500/70" />
          <p className="text-sm font-medium text-red-600">
            Error loading categories: {errorCats}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background">

      {/* 1 ── HERO ─────────────────────────────────────── */}
      <HomeHero categories={categories} />

      {/* 2 ── CATEGORY PILLS STRIP ────────────────────── */}
      <HomeCategoriesRow categories={categories} isLoading={loadingCats} />
    <Showservices/>
      {/* 3 ── PRODUCT DISCOVERY (Tabs) ──── */}
      {!loadingCats && categories.length > 0 && (
        <CategoryProductsSection categories={categories.slice(0, 4)} />
      )}

      {/* 4 ── BRAND STORY ─────────────────────────────── */}
      {/* <HomeBrandStory /> */}


      {/* 8 ── FINAL CTA ───────────────────────────────── */}
      <HomeFinalCTA />

    </div>
  );
}
