'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { ordersAdmin } from '@/services/orders';
import { ArrowLeft, CreditCard, DollarSign, ExternalLink, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import { OrderStatus, PaymentStatus } from '@/types/orders.interface';

const orderStatuses: OrderStatus[] = ['pending', 'inprogress', 'delivered', 'faild_delivered', 'return'];
const paymentStatuses: PaymentStatus[] = ['pending', 'approve', 'reject'];

const orderStatusLabels: Record<OrderStatus, [string, string]> = {
  pending: ['Pending', 'قيد الانتظار'],
  inprogress: ['In progress', 'قيد التنفيذ'],
  delivered: ['Delivered', 'تم التسليم'],
  faild_delivered: ['Delivery failed', 'فشل التسليم'],
  return: ['Returned', 'مرتجع'],
};

const paymentStatusLabels: Record<PaymentStatus | 'faild', [string, string]> = {
  pending: ['Pending', 'قيد الانتظار'],
  approve: ['Approved', 'تم القبول'],
  reject: ['Rejected', 'مرفوض'],
  faild: ['Failed', 'فشل'],
};

function formatLabel(labels: [string, string], locale: string) {
  return labels[locale === 'ar' ? 1 : 0];
}

export default function OrderDetailsPage() {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('admin');
  const { data: order, isLoading, refetch } = useApiGet(ordersAdmin.getOrder, id, locale);
  const { execute: updateStatus } = useApiAction(ordersAdmin.changeOrderStatus, { showSuccessToast: true });
  const { execute: updatePayment } = useApiAction(ordersAdmin.changePaymentStatus, { showSuccessToast: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: OrderStatus) => {
    setIsUpdating(true);
    try {
      const result = await updateStatus(id, status);
      if (result.success) await refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentChange = async (status: PaymentStatus) => {
    setIsUpdating(true);
    try {
      const result = await updatePayment(id, status);
      if (result.success) await refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 flex justify-center items-center h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-muted-foreground">{t('table.noResults')}</div>;
  }

  const products = order.order_products ?? [];
  const paymentMethodName = typeof order.payment_method === 'object'
    ? (order.payment_method as { name?: string } | null)?.name ?? '—'
    : (order.payment_method ?? '—');
  const displayedPaymentStatuses: Array<PaymentStatus | 'faild'> = order.payment_status === 'faild'
    ? ['faild', ...paymentStatuses]
    : paymentStatuses;
  const addressLines = order.address
    ? [
        order.address.address,
        order.address.street,
        order.address.building_number ? `Building ${order.address.building_number}` : null,
        order.address.floor ? `Floor ${order.address.floor}` : null,
        [order.address.city, order.address.zone].filter(Boolean).join(', ') || null,
        order.address.additional_data,
      ].filter((line): line is string => Boolean(line))
    : [];
  const hasValidMap = Boolean(order.address?.map) && (order.address?.lat !== '0' || order.address?.lng !== '0');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('pages.orders.details')} #{order.id}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground text-lg">{t('pages.orders.products')}</h2>
            </div>
            {products.length > 0 ? (
              <div className="divide-y divide-border">
                {products.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted shrink-0 overflow-hidden relative">
                      {item.product?.image ? (
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground m-auto mt-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base truncate">
                        {item.product?.name ?? `${t('pages.orders.productUnavailable')} #${item.id}`}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.count} × {item.final_price}</p>
                      {item.options.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.options.map((option) => `${option.variation}: ${option.name}`).join(' · ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-foreground text-lg">{item.final_price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">{t('table.empty')}</div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-foreground text-lg">{t('pages.orders.receipt')}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">{order.price}</span></div>
              <div className="flex justify-between items-center text-sm text-red-500"><span>Discount</span><span className="font-medium">-{order.discount}</span></div>
              <div className="flex justify-between items-center text-sm text-red-500"><span>Coupon discount</span><span className="font-medium">-{order.coupon_discount}</span></div>
              <div className="pt-4 border-t border-border flex justify-between items-center"><span className="font-bold text-foreground text-base">{t('table.total')}</span><span className="font-bold text-emerald-600 text-xl">{order.final_price}</span></div>
            </div>
            {order.receipt_url && (
              <a href={order.receipt_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                <ExternalLink className="w-4 h-4" /> View receipt
              </a>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-foreground text-base mb-4">{t('pages.orders.user')}</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span className="text-primary font-bold text-lg">{order.user?.name.charAt(0).toUpperCase() || '?'}</span></div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{order.user?.name || '—'}</p>
                <p className="text-sm text-muted-foreground truncate">{order.user?.email || '—'}</p>
                <p className="text-sm text-muted-foreground">{order.user?.phone || '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary" /><h2 className="font-bold text-foreground text-base">{t('pages.orders.address')}</h2></div>
            {addressLines.length > 0 ? (
              <div className="text-sm text-muted-foreground space-y-1">
                {addressLines.map((line) => <p key={line}>{line}</p>)}
                {hasValidMap && <a href={order.address?.map ?? '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><ExternalLink className="w-3.5 h-3.5" /> View on map</a>}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-2">No address provided</p>}
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4"><CreditCard className="w-5 h-5 text-amber-500" /><h2 className="font-bold text-foreground text-base">{t('pages.orders.paymentMethod')}</h2></div>
            <p className="text-sm font-medium text-foreground">{paymentMethodName}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-foreground text-lg mb-4">{t('pages.orders.details')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
            {t('pages.orders.status')}
            <select
              className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              value={order.status}
              onChange={(event) => void handleStatusChange(event.target.value as OrderStatus)}
              disabled={isUpdating}
            >
              {orderStatuses.map((status) => (
                <option key={status} value={status}>{formatLabel(orderStatusLabels[status], locale)}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
            {t('pages.orders.paymentStatus')}
            <select
              className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              value={order.payment_status}
              onChange={(event) => void handlePaymentChange(event.target.value as PaymentStatus)}
              disabled={isUpdating}
            >
              {displayedPaymentStatuses.map((status) => (
                <option key={status} value={status} disabled={status === 'faild'}>{formatLabel(paymentStatusLabels[status], locale)}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
