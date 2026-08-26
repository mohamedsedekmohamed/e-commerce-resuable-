'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, FileText, ShoppingCart, Sparkles, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { userHome } from '@/services/userHome';
import { userCart } from '@/services/userCart';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { authService } from '@/services/auth';
import { useCartStore } from '@/store/useCartStore';
import { StoreCartResponse, StorePaginatedResponse, StoreProduct, StoreCategory } from '@/types/store.interface';
import RevealBox from '@/components/shared/RevealBox';

interface CategoryProductsSectionProps {
  categories: StoreCategory[];
}

function ProductTile({ product, locale }: { product: StoreProduct; locale: string }) {
  const t = useTranslations('common');
  const router = useRouter();
  const isRtl = locale === 'ar';
  const imgUrl = product.image && product.image.trim() !== '' ? product.image : null;
  const hasDiscount = Number(product.discount) > 0;
  const displayPrice = product.final_price || product.price;

  const { execute: addToCart, isLoading: isAdding } = useApiAction(userCart.store, {
    showSuccessToast: true,
  });

  const { execute: updateCart, isLoading: isUpdating } = useApiAction(userCart.update, {
    showSuccessToast: true,
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || isUpdating) return;

    if (!authService.getToken('user')) {
      toast.error(isRtl ? 'يجب تسجيل الدخول أولاً لإضافة منتجات للسلة' : 'You must log in to add items to cart');
      router.push(`/${locale}/auth/login`);
      return;
    }

    try {
      const cartRes = await userCart.index(locale);
      const cartData = cartRes.data as StoreCartResponse;
      const cartItems = cartData.cart ?? [];
      const existingItem = cartItems.find(
        item => String(item.product?.id) === String(product.id)
      );

      let res;
      if (existingItem) {
        res = await updateCart(existingItem.cart_product_id, {
          local: locale,
          count: Number(existingItem.count) + 1,
        });
      } else {
        res = await addToCart({
          local: locale,
          product_id: product.id,
          count: 1,
          variations: []
        });
      }
      if (res) {
        useCartStore.getState().fetchCart(locale);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(250,204,21,0.2)] hover:border-yellow-400/50">
      
      {/* ── Image Area ── */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.05]">
        <Link href={`/${locale}/catalog/${product.id}`} className="absolute inset-0 z-10" />
        
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={product.name}
            fill
            sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 20vw"
            className="object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-black text-foreground/[0.04] uppercase select-none">
              {(product.name || 'P').charAt(0)}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} z-20 rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-black text-white shadow-md`}>
            -{product.discount}%
          </span>
        )}

        {/* PDF Badge */}
        {product.pdf && product.pdf.trim() !== '' && (
          <a
            href={product.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 shadow-sm text-foreground/50 transition-all duration-300 hover:bg-yellow-400 hover:text-black backdrop-blur-sm`}
            title="PDF"
          >
            <FileText className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-3">
        {product.brand && (
          <span className="mb-1 text-[9px] font-bold tracking-[0.2em] uppercase text-yellow-600 dark:text-yellow-500">
            {product.brand}
          </span>
        )}
        <Link href={`/${locale}/catalog/${product.id}`} className="focus:outline-none">
          <h3 className="text-[13px] sm:text-[14px] font-semibold leading-snug text-foreground/85 line-clamp-2 transition-colors duration-200 group-hover:text-yellow-500">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-lg font-black tracking-tight text-foreground">{displayPrice}</span>
          {hasDiscount && (
            <span className="mb-0.5 text-[11px] font-medium text-foreground/35 line-through">
              {product.price}
            </span>
          )}
        </div>
      </div>

      {/* ── Action Buttons (Always Visible) ── */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {/* View Product */}
        <Link
          href={`/${locale}/catalog/${product.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-foreground/[0.03] py-2.5 text-[12px] font-bold text-foreground/70 transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          <Eye className="h-4 w-4" />
          <span>{t('view')}</span>
        </Link>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 py-2.5 text-[12px] font-bold text-black transition-all duration-300 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/25 disabled:opacity-50"
        >
          {isAdding ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          <span>{t('add_to_cart')}</span>
        </button>
      </div>
    </div>
  );
}

export default function CategoryProductsSection({
  categories
}: CategoryProductsSectionProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [activeCategoryId, setActiveCategoryId] = useState<number>(
    categories.length > 0 ? Number(categories[0].id) : 0
  );

  const [isFading, setIsFading] = useState(false);

  const handleTabClick = (id: number) => {
    if (id === activeCategoryId) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveCategoryId(id);
      setIsFading(false);
    }, 200);
  };

  const { data, isLoading } = useApiGet(userHome.products, locale, activeCategoryId, 1);
  const response = data as StorePaginatedResponse<StoreProduct> | StoreProduct[] | null;
  const products = Array.isArray(response) ? response : response?.data ?? [];

  if (!categories || categories.length === 0) return null;

  const activeCategory = categories.find(c => Number(c.id) === activeCategoryId) || categories[0];
  const sectionTitle = isRtl ? 'اكتشف الأقسام' : 'Discover Categories';

  return (
    <RevealBox
      animation="fade-up"
      as="section"
      className="bg-background pt-16 pb-24 border-b border-border"
      dir={t('ltr')}
    >
      <div className="container">

        {/* ── 1. Header & Tabs ── */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-yellow-600 dark:text-yellow-500">
              {t('shop_by_section')}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-yellow-500 tracking-tight mb-10 drop-shadow-sm">
            {sectionTitle}
          </h2>

          {/* ── Tabs (Category Pills) ── */}
          <div className="flex items-center justify-center flex-wrap gap-3 max-w-4xl mx-auto">
            {categories.map((cat) => {
              const isActive = activeCategoryId === Number(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleTabClick(Number(cat.id))}
                  className={`
                    relative px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300
                    ${isActive 
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105' 
                      : 'bg-card text-foreground/70 hover:bg-yellow-400/5 hover:text-yellow-500 border border-border/50 hover:border-yellow-400/50'
                    }
                  `}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Products Grid (with smooth transition) ── */}
        <div 
          className={`transition-all duration-300 transform min-h-[400px] ${isFading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          {isLoading && !isFading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-foreground/5 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {products.slice(0, 4).map(p => (
                <ProductTile key={p.id} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-bold">{isRtl ? 'لا توجد منتجات في هذا القسم' : 'No products in this category'}</p>
            </div>
          )}
        </div>

        {/* ── 3. View All Button for Active Category ── */}
        <div className="flex justify-center mt-12">
          <Link
            href={`/${locale}/categories/${activeCategory.id}?name=${encodeURIComponent(activeCategory.name)}`}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-yellow-400 text-black text-sm font-bold tracking-[0.1em] uppercase shadow-lg transition-all duration-300 hover:bg-yellow-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/30 focus-visible:outline-none"
          >
            <span>{isRtl ? `عرض كل منتجات ${activeCategory.name}` : `View all in ${activeCategory.name}`}</span>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover:bg-black/20">
              {isRtl
                ? <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </span>
          </Link>
        </div>

      </div>
    </RevealBox>
  );
}