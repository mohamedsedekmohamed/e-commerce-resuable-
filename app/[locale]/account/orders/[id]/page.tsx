'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { userOrder } from '@/services/userOrder';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Package, MapPin, Receipt } from 'lucide-react';
import { StoreOrder } from '@/types/store.interface';

export default function OrderDetailsPage() {
  const t = useTranslations('user_dashboard');
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const isRtl = locale === 'ar';
  
  const routeId = params.id;
  const id = Array.isArray(routeId) ? routeId[0] : routeId;

  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await userOrder.orderDetails(id, locale);
        const response = res.data as unknown;
        const nextOrder = typeof response === 'object' && response !== null && 'data' in response
          ? (response as { data?: StoreOrder }).data ?? null
          : response as StoreOrder;
        setOrder(nextOrder);
      } catch (err) {
        console.error('Failed to load order details:', err);
        router.push(`/${locale}/account/orders`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, locale, router]);

  const getStatusTranslation = (status: string) => {
    if (!status) return '';
    const key = `status_${status.toLowerCase()}`;
    if (t.has(key)) return t(key as Parameters<typeof t>[0]);
    return status;
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success') {
      return <span className="px-3 py-1.5 bg-green-500/10 text-green-500 font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
    }
    if (s === 'failed' || s === 'faild' || s === 'cancelled') {
      return <span className="px-3 py-1.5 bg-destructive/10 text-destructive font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
    }
    return <span className="px-3 py-1.5 bg-primary/10 text-primary font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-8 bg-foreground/5 w-1/3 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-foreground/5 rounded"></div>
            <div className="h-40 bg-foreground/5 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-60 bg-foreground/5 rounded"></div>
            <div className="h-40 bg-foreground/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link 
              href={`/${locale}/account/orders`}
              className="w-8 h-8 flex items-center justify-center bg-foreground/5 text-foreground/70 hover:bg-primary hover:text-white rounded-full transition-colors"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </Link>
            <h1 className="text-2xl font-bold text-foreground capitalize tracking-wide">
              {t('order_details')} #{order.id}
            </h1>
          </div>
          <p className="text-sm text-foreground/60 flex items-center gap-2">
            <span>{order.created_at && new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          {getStatusBadge(order.payment_status === 'faild' ? 'failed' : order.payment_status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Products */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-foreground/5 flex items-center gap-2 font-semibold">
              <Package className="w-5 h-5 text-primary" />
              {t('products')}
            </div>
            <div className="flex flex-col divide-y divide-border">
              {order.order_products?.map(item => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="relative w-20 h-20 shrink-0 bg-foreground/5 rounded-md overflow-hidden">
                    {item.product?.image ? (
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name || 'Product'} 
                        fill 
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.product?.name}</h4>
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-foreground/60">
                          {item.options.map(option => (
                            <span key={option.id} className="bg-foreground/5 px-2 py-0.5 rounded">
                              {option.variation}: {option.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-foreground/70">{t('quantity')}: {item.count}</span>
                      <div className="flex items-center gap-2">
                        {Number(item.discount) > 0 && (
                          <span className="text-xs line-through text-foreground/40">{item.price}</span>
                        )}
                        <span className="font-bold text-primary">{item.final_price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Address */}
        <div className="flex flex-col gap-6">
          {/* Summary */}
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-foreground/5 flex items-center gap-2 font-semibold">
              <Receipt className="w-5 h-5 text-primary" />
              {t('financial_summary')}
            </div>
            <div className="p-5 flex flex-col gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">{t('price')}</span>
                <span className="font-semibold">{order.price}</span>
              </div>
              
              {Number(order.discount) > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>{t('discount')}</span>
                  <span className="font-semibold">-{order.discount}</span>
                </div>
              )}
              
              {Number(order.coupon_discount) > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>{t('coupon')} {order.coupon?.name ? `(${order.coupon.name})` : ''}</span>
                  <span className="font-semibold">-{order.coupon_discount}</span>
                </div>
              )}

              <div className="border-t border-border pt-4 mt-2 flex items-center justify-between">
                <span className="font-bold text-foreground text-base">{t('total')}</span>
                <span className="font-bold text-primary text-xl">{order.final_price}</span>
              </div>

              {order.payment_method && (
                <div className="mt-4 p-3 bg-foreground/5 rounded-md flex items-center justify-between">
                  <span className="text-foreground/70">{t('payment_method')}</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    {order.payment_method.icon && (
                      <div className="relative w-5 h-5">
                        <Image src={order.payment_method.icon} alt={order.payment_method.name ?? 'Payment method'} fill className="object-contain" />
                      </div>
                    )}
                    {order.payment_method.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border bg-foreground/5 flex items-center gap-2 font-semibold">
                <MapPin className="w-5 h-5 text-primary" />
                {t('shipping_address')}
              </div>
              <div className="p-5 flex flex-col gap-3 text-sm">
                <p className="font-medium text-foreground">{order.address.address}</p>
                <div className="flex flex-col gap-3 text-foreground/80 mt-2">
                  {order.address.city && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-foreground/60">{t('city')}</span>
                      <span className="font-medium text-foreground">{order.address.city}</span>
                    </div>
                  )}
                  {order.address.zone && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-foreground/60">{t('zone')}</span>
                      <span className="font-medium text-foreground">{order.address.zone}</span>
                    </div>
                  )}
                  {order.address.street && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-foreground/60">{t('street')}</span>
                      <span className="font-medium text-foreground">{order.address.street}</span>
                    </div>
                  )}
                  {order.address.building_number && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-foreground/60">{t('building_number')}</span>
                      <span className="font-medium text-foreground">{order.address.building_number}</span>
                    </div>
                  )}
                  {order.address.floor && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-foreground/60">{t('floor')}</span>
                      <span className="font-medium text-foreground">{order.address.floor}</span>
                    </div>
                  )}
                </div>
                {order.address.additional_data && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <span className="font-semibold text-foreground/90 block mb-1">{t('additional_data')}:</span>
                    <p className="text-foreground/70">{order.address.additional_data}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
