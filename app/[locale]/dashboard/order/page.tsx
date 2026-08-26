'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { ordersAdmin } from '@/services/orders';
import { useApiGet } from '@/hooks/useApi';
import { Eye } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { OrderStatus, OrderSummary, PaymentStatus } from '@/types/orders.interface';

const statusTone: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  inprogress: 'bg-sky-50 text-sky-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  faild_delivered: 'bg-red-50 text-red-700',
  return: 'bg-violet-50 text-violet-700',
};

const paymentTone: Record<PaymentStatus | 'faild', string> = {
  pending: 'bg-amber-50 text-amber-700',
  approve: 'bg-emerald-50 text-emerald-700',
  reject: 'bg-red-50 text-red-700',
  faild: 'bg-red-50 text-red-700',
};

function statusLabel(status: OrderStatus, locale: string) {
  const labels: Record<OrderStatus, [string, string]> = {
    pending: ['Pending', 'قيد الانتظار'],
    inprogress: ['In progress', 'قيد التنفيذ'],
    delivered: ['Delivered', 'تم التسليم'],
    faild_delivered: ['Delivery failed', 'فشل التسليم'],
    return: ['Returned', 'مرتجع'],
  };

  return labels[status][locale === 'ar' ? 1 : 0];
}

function paymentLabel(status: PaymentStatus | 'faild', locale: string) {
  const labels: Record<PaymentStatus | 'faild', [string, string]> = {
    pending: ['Pending', 'قيد الانتظار'],
    approve: ['Approved', 'تم القبول'],
    reject: ['Rejected', 'مرفوض'],
    faild: ['Failed', 'فشل'],
  };

  return labels[status][locale === 'ar' ? 1 : 0];
}

export default function OrdersPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('admin');
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isFetching } = useApiGet(
    ordersAdmin.getOrders,
    locale,
    { page },
  );

  const rows = response?.data ?? [];
  const columns: TableColumn<OrderSummary>[] = [
    
    {
      key: 'user',
      header: t('pages.orders.user'),
      render: (_, row) => <span className="font-medium text-foreground">{row.user || '—'}</span>,
    },
    {
      key: 'final_price',
      header: t('table.total'),
      render: (_, row) => <span className="font-semibold text-emerald-600">{row.final_price}</span>,
    },
    {
      key: 'status',
      header: t('pages.orders.status'),
      render: (_, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusTone[row.status]}`}>
          {statusLabel(row.status, locale)}
        </span>
      ),
    },
    {
      key: 'payment_status',
      header: t('pages.orders.paymentStatus'),
      render: (_, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentTone[row.payment_status]}`}>
          {paymentLabel(row.payment_status, locale)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={5} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<OrderSummary>
        title={t('pages.orders.title')}
        subtitle={t('pages.orders.subtitle')}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={response?.current_page ?? page}
        serverTotalPages={response?.last_page ?? 1}
        serverTotalItems={response?.total ?? 0}
        rowsPerPage={response?.per_page ?? 15}
        onServerPageChange={setPage}
        hasSearch={false}
        extraActions={(row) => (
          <button
            type="button"
            onClick={() => router.push(`/${locale}${ROUTES.dashboard.orderDetails(row.id)}`)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
            title={t('table.view')}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        renderCard={(row) => (
          <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-primary text-[16px]">#{row.id}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${statusTone[row.status]}`}>
                    {statusLabel(row.status, locale)}
                  </span>
                </div>
                <p className="text-[14px] font-medium text-foreground truncate">{row.user || '—'}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[16px] text-emerald-600 block">{row.final_price}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${paymentTone[row.payment_status]}`}>
                  {paymentLabel(row.payment_status, locale)}
                </span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-1.5 bg-background">
              <button
                onClick={() => router.push(`/${locale}${ROUTES.dashboard.orderDetails(row.id)}`)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-[10px] hover:bg-primary hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {t('table.view')}
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
