'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { userCart } from '@/services/userCart';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Plus, Minus, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { StoreCartItem, StoreCartResponse, StoreEntityId } from '@/types/store.interface';
import { useCartStore } from '@/store/useCartStore';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const { items: cartItems, isLoading, fetchCart } = useCartStore();
  const [updatingId, setUpdatingId] = useState<StoreEntityId | null>(null);

  useEffect(() => {
    if (!authService.getToken('user')) {
      router.push(`/${locale}/auth/login?redirect=cart`);
      return;
    }
    fetchCart(locale);
  }, [locale, fetchCart, router]);

  const handleRemove = async (id: StoreEntityId) => {
    try {
      await userCart.destroy(id);
      fetchCart(locale);
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const handleUpdateCount = async (id: StoreEntityId, newCount: number) => {
    if (newCount < 1) return;
    setUpdatingId(id);
    try {
      await userCart.update(id, { local: locale, count: newCount });
      fetchCart(locale);
    } catch (err) {
      console.error('Failed to update quantity', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClear = async () => {
    try {
      await userCart.clear();
      fetchCart(locale);
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.final_price || item.product?.price || 0;
      return total + (Number(price) * Number(item.count));
    }, 0);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 flex flex-col gap-10 min-h-[50vh]">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground/70">{t('empty_cart')}</h2>
            <Link 
              href={`/${locale}/catalog`}
              className="px-8 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t('continue_shopping')}
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container py-10 flex flex-col gap-8">
        
        {/* Top Header with Back to Home & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/${locale}`}
              className="w-10 h-10 bg-white border border-border shadow-sm rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/50 transition-colors"
              title={isRtl ? 'الرجوع للرئيسية' : 'Back to Home'}
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              {t('title')}
            </h1>
          </div>
          <button 
            onClick={handleClear}
            className="text-sm font-medium text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-md hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            {t('clear_cart')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.cart_product_id} className="flex gap-4 p-5 border border-border/60 rounded-xl bg-white shadow-sm relative group hover:border-primary/30 transition-colors">
                <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-border/40">
                {item.product?.image ? (
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name || 'Product'} 
                    fill 
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground/20">
                      {(item.product?.name || 'P').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 pe-8">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-2">{item.product?.name}</h3>
                  {item.variations && item.variations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.variations.map(variation => (
                        <span key={variation.variation_id} className="text-xs bg-foreground/5 px-2 py-0.5 rounded text-foreground/60">
                          {variation.variation_name}: {variation.selected_option?.option_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 shrink-0 sm:pe-8">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-border rounded-md bg-background overflow-hidden">
                    <button 
                      onClick={() => Number(item.count) <= 1
                        ? handleRemove(item.cart_product_id)
                        : handleUpdateCount(item.cart_product_id, Number(item.count) - 1)}
                      disabled={updatingId === item.cart_product_id}
                      className="p-1.5 hover:bg-foreground/5 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {updatingId === item.cart_product_id ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-primary" />
                      ) : (
                        item.count
                      )}
                    </span>
                    <button 
                      onClick={() => handleUpdateCount(item.cart_product_id, Number(item.count) + 1)}
                      disabled={updatingId === item.cart_product_id}
                      className="p-1.5 hover:bg-foreground/5 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col items-end min-w-[70px]">
                    {Number(item.product?.discount) > 0 && (
                      <span className="text-xs line-through text-foreground/40">{item.product?.price}</span>
                    )}
                    <span className="font-bold text-foreground text-lg leading-tight">{item.product?.final_price || item.product?.price}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleRemove(item.cart_product_id)}
                className="absolute top-4 end-4 text-foreground/30 hover:text-destructive transition-colors p-1"
                aria-label={t('remove')}
                title={t('remove')}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-6">
          <div className="border border-border/60 rounded-xl bg-white shadow-sm p-6 flex flex-col gap-4 sticky top-24">
            <h3 className="font-bold text-lg border-b border-border pb-3">{t('subtotal')}</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/70">{t('items_count', { count: cartItems.length })}</span>
              <span className="font-semibold">{calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
              <span className="font-bold text-base">{t('total')}</span>
              <span className="font-bold text-xl text-primary">{calculateSubtotal().toFixed(2)}</span>
            </div>

            <Link 
              href={`/${locale}/checkout`}
              className="mt-4 w-full py-3.5 bg-secondary text-white font-semibold rounded-lg shadow hover:bg-secondary-400 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {t('checkout')}
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
