'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { userOrder } from '@/services/userOrder';
import Link from 'next/link';
import { StoreOrder, StorePaginatedResponse } from '@/types/store.interface';

function AccountOrdersContent() {
  const t = useTranslations('user_dashboard');
  const locale = useLocale();
  
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userOrder.orderHistory(locale);
        const response = res.data as StorePaginatedResponse<StoreOrder>;
        setOrders(response.data ?? []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [locale]);

  const getStatusTranslation = (status: string) => {
    if (!status) return '';
    const key = `status_${status.toLowerCase()}`;
    if (t.has(key)) return t(key as Parameters<typeof t>[0]);
    return status;
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'success') {
      return <span className="px-2.5 py-1 bg-green-500/10 text-green-500 font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
    }
    if (s === 'failed' || s === 'faild' || s === 'cancelled') {
      return <span className="px-2.5 py-1 bg-destructive/10 text-destructive font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
    }
    return <span className="px-2.5 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full">{getStatusTranslation(s)}</span>;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground capitalize tracking-wide">
          {t('order_history')}
        </h1>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right border-collapse">
          <thead className="bg-foreground/5 text-foreground/80 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-border">{t('order_id')}</th>
              <th className="px-6 py-4 font-bold border-b border-border">{t('date')}</th>
              <th className="px-6 py-4 font-bold border-b border-border">{t('final_price')}</th>
              <th className="px-6 py-4 font-bold border-b border-border">{t('status')}</th>
              <th className="px-6 py-4 font-bold border-b border-border">{t('payment_status')}</th>
              <th className="px-6 py-4 font-bold border-b border-border text-center"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-foreground/10 w-8 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-foreground/10 w-24 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-foreground/10 w-20 rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-foreground/10 w-20 rounded-full"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-foreground/10 w-20 rounded-full"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-foreground/10 w-24 rounded"></div></td>
                </tr>
              ))
            ) : orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground align-middle">#{order.id}</td>
                  <td className="px-6 py-4 text-foreground/70 align-middle whitespace-nowrap">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 align-middle whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{order.final_price}</span>
                      {Number(order.discount) > 0 && (
                        <span className="text-xs line-through text-foreground/50">{order.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {getStatusBadge(order.payment_status === 'faild' ? 'failed' : order.payment_status)}
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <Link
                      href={`/${locale}/account/orders/${order.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold bg-secondary text-foreground rounded-lg hover:bg-secondary-400 transition-colors whitespace-nowrap shadow-sm"
                    >
                      {t('view_details')}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-foreground/50">
                  {t('no_orders')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AccountOrdersContent />
    </Suspense>
  );
}
