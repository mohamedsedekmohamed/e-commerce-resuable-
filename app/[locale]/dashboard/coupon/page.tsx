'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { couponsAdmin } from '@/services/coupons';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Eye, FileEdit, Trash2, Calendar, Tag, Percent, DollarSign } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'precentage' | 'fixed' | 'value';
  discount: string | number;
  from?: string | null;
  to?: string | null;
  valid_from?: string | null;
  valid_to?: string | null;
  usage_limit?: number | null;
  user_limit?: number | null;
  user_usage_limit?: number | null;
  used_count?: number;
}

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isPercentageCoupon = (type: Coupon['type']) => type === 'percentage' || type === 'precentage';
const couponStartDate = (coupon: Coupon) => coupon.from ?? coupon.valid_from ?? null;
const couponEndDate = (coupon: Coupon) => coupon.to ?? coupon.valid_to ?? null;

export default function CouponsPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<Coupon>[] = [
    {
      key: 'code',
      header: t('pages.coupons.code'),
      render: (_, row) => (
        <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 tracking-wider">
          {row.code}
        </span>
      ),
    },
    {
      key: 'discount',
      header: t('pages.coupons.discount'),
      render: (_, row) => (
        <div className="flex items-center gap-1.5 font-bold">
          {isPercentageCoupon(row.type) ? (
            <span className="text-emerald-600 flex items-center gap-1">
              {row.discount} <Percent className="w-3 h-3" />
            </span>
          ) : (
            <span className="text-amber-600 flex items-center gap-1">
              {row.discount} <DollarSign className="w-3 h-3" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'to',
      header: t('pages.coupons.to'),
      render: (_, row) => (
        <span className="text-sm text-muted-foreground">{fmt(couponEndDate(row))}</span>
      )
    },
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(couponsAdmin.getCoupons, locale);
  const { execute: deleteCoupon } = useApiAction(couponsAdmin.deleteCoupon, { successMsg: tForm('successDelete') });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Coupon | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const response = data ?? null;
  const rows: Coupon[] = response?.data?.data ?? response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<Coupon>
        title={t('pages.coupons.title')}
        subtitle={t('pages.coupons.subtitle')}
        titleAdd={t('pages.coupons.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.couponAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.couponEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide={false}
        renderCard={(row, { onEdit }) => (
          <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20 tracking-wider text-[15px] inline-block mb-2">
                  {row.code}
                </span>
                <p className="text-[13px] text-muted-foreground">
                  Used {row.used_count || 0} times {row.usage_limit ? `(Limit: ${row.usage_limit})` : ''}
                </p>
              </div>
              <div className="text-right">
                <span className={`font-black text-[20px] ${isPercentageCoupon(row.type) ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {row.discount}
                  {isPercentageCoupon(row.type) ? '%' : ''}
                </span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-4 h-4 opacity-70 text-emerald-500" />
                <span className="truncate">{fmt(couponStartDate(row))}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-4 h-4 opacity-70 text-red-500" />
                <span className="truncate">{fmt(couponEndDate(row))}</span>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-1.5 bg-background">
              {onEdit && (
                <button onClick={() => onEdit(row)} className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors text-muted-foreground" title={t('table.edit')}>
                  <FileEdit className="w-[18px] h-[18px]" />
                </button>
              )}
              <button onClick={() => setConfirmDeleteRow(row)} className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-red-50 hover:text-red-600 transition-colors text-red-500" title={t('table.delete')}>
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        )}
        onDelete={(row) => setConfirmDeleteRow(row)}
        extraActions={(row) => (
          <button
            onClick={() => setViewId(row.id)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors"
            title={t('table.view')}
          >
            <Eye className="w-[16px] h-[16px] text-muted-foreground" strokeWidth={1.33} />
          </button>
        )}
      />

      {viewId !== null && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await couponsAdmin.getCoupon(viewId, locale);
            const c = res.data as Coupon;
            return {
              title: t('pages.coupons.details'),
              avatar: { fallback: '%' },
              subtitle: { label: c.code, badge: true },
              fields: [
                { icon: <Tag className="w-4 h-4" />, label: t('pages.coupons.code'), value: c.code },
                { icon: <Percent className="w-4 h-4" />, label: t('pages.coupons.discount'), value: c.discount },
                { label: t('pages.coupons.type'), value: c.type },
                { label: t('pages.coupons.usageLimit'), value: c.usage_limit || 'Unlimited' },
                { label: t('pages.coupons.userUsageLimit'), value: c.user_usage_limit ?? c.user_limit ?? 'Unlimited' },
                { icon: <Calendar className="w-4 h-4 text-emerald-500" />, label: t('pages.coupons.from'), value: fmt(couponStartDate(c)) },
                { icon: <Calendar className="w-4 h-4 text-red-500" />, label: t('pages.coupons.to'), value: fmt(couponEndDate(c)) },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.coupons.delete')}
          description={t('pages.coupons.deleteConfirm', { name: confirmDeleteRow.code })}
          onConfirm={async () => {
            await deleteCoupon(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
