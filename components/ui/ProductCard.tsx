'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ImageOff, ShoppingCart, Eye } from 'lucide-react'; // تم إضافة أيقونة Eye
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { userCart } from '@/services/userCart';
import { useApiAction } from '@/hooks/useApi';
import { StoreCartResponse, StoreProduct } from '@/types/store.interface';
import { useCartStore } from '@/store/useCartStore';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: StoreProduct;
  locale: string;
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/15 gap-1">
        <ImageOff className="w-8 h-8" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain p-4 group-hover:scale-[1.08] transition-transform duration-500 ease-out"
      sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 20vw"
      onError={() => setErr(true)}
    />
  );
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const isRtl = locale === 'ar';
  const hasImg = !!(product.image && product.image.trim() !== '');
  const hasDiscount = Number(product.discount) > 0;
  const hasPdf = !!(product.pdf && product.pdf.trim() !== '');
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
      // Fetch current cart to check for existing item
      const cartRes = await userCart.index(locale);
      const cartData = cartRes.data as StoreCartResponse;
      const cartItems = cartData.cart ?? [];
      const existingItem = cartItems.find(
        item => String(item.product?.id) === String(product.id)
      );

      let res;
      if (existingItem) {
        // Update count if it already exists
        res = await updateCart(existingItem.cart_product_id, {
          local: locale,
          count: Number(existingItem.count) + 1,
        });
      } else {
        // Add new item
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
    <div className="group relative flex flex-col bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-[0_8px_30px_-12px_rgba(250,204,21,0.2)] hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-1">

      {/* ── Image Section ── */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-b from-primary/5 to-transparent flex items-center justify-center">
        
        {/* رابط الصورة */}
        <Link href={`/${locale}/catalog/${product.id}`} className="absolute inset-0 z-10 focus-visible:outline-none" />

        {hasImg ? (
          <ProductImage src={product.image!} alt={product.name || 'Product'} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black text-foreground/5 uppercase">
              {(product.name || 'P').charAt(0)}
            </span>
          </div>
        )}

        {/* بادج الخصم */}
        {hasDiscount && (
          <span className={`absolute top-3 z-20 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider shadow-sm bg-red-500 text-white ${isRtl ? 'right-3' : 'left-3'}`}>
            -{product.discount}%
          </span>
        )}

        {/* بادج الـ PDF */}
        {hasPdf && (
          <a
            href={product.pdf!}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute top-3 z-30 flex w-8 h-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-border text-foreground/50 hover:text-primary hover:border-primary shadow-sm transition-all duration-200 ${isRtl ? 'left-3' : 'right-3'}`}
            title="Product PDF"
          >
            <FileText className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* ── Info & Actions Section ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 bg-card relative z-20">
        
        {/* رابط النصوص */}
        <Link href={`/${locale}/catalog/${product.id}`} className="flex flex-col flex-1 gap-1.5 mb-4 group/info focus-visible:outline-none">
          {product.brand && (
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-yellow-600 dark:text-yellow-500">
              {product.brand}
            </span>
          )}
          
          <h3 className="text-sm sm:text-[15px] font-bold text-foreground line-clamp-2 leading-snug group-hover/info:text-yellow-500 transition-colors duration-200 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-end gap-2 mt-auto pt-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-black text-foreground leading-none">{product.final_price}</span>
                <span className="text-xs font-medium text-foreground/40 line-through leading-none mb-0.5">{product.price}</span>
              </>
            ) : (
              <span className="text-lg font-black text-foreground leading-none">{displayPrice || ''}</span>
            )}
          </div>
        </Link>

        {/* ── Buttons Row (عرضي) ── */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          
          {/* زر المشاهدة */}
          <Link
            href={`/${locale}/catalog/${product.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground/70 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all duration-200 text-xs font-bold focus-visible:outline-none"
          >
            <Eye className="w-3.5 h-3.5" />
            {t('view')}
          </Link>

          {/* زر أضف للسلة */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-md transition-all duration-200 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none"
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            {t('add_to_cart')}
          </button>

        </div>
      </div>
    </div>
  );
}