'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { paymentMethodsAdmin } from '@/services/paymentMethods';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { FileEdit, Trash2, CreditCard } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
import { getLocalizedText, LocalizedText } from '../dashboard-utils';

interface PaymentMethod {
  id: number;
  name: LocalizedText;
  icon: string | null;
  status: number | boolean;
}

export default function PaymentMethodsPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<PaymentMethod>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => {
        const name = getLocalizedText(row.name, locale);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
              {row.icon ? (
                <Image src={typeof row.icon === 'string' && !row.icon.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${row.icon}` : row.icon} alt={name} fill className="object-contain p-1" />
              ) : (
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-foreground text-sm">{name}</p>
          </div>
        );
      },
    },
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(paymentMethodsAdmin.getPaymentMethods, locale);
  const { execute: deleteMethod } = useApiAction(paymentMethodsAdmin.deletePaymentMethod, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus } = useApiAction(paymentMethodsAdmin.changePaymentMethodStatus, { showSuccessToast: true });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<PaymentMethod | null>(null);

  const response = data ?? null;
  const rows: PaymentMethod[] = response?.data?.data ?? response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={6} cols={3} />
      </div>
    );
  }

  const handleToggleStatus = async (row: PaymentMethod) => {
    const newStatus = (row.status === 1 || row.status === true) ? false : true;
    await toggleStatus(row.id, newStatus);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<PaymentMethod>
        title={t('pages.paymentMethods.title')}
        subtitle={t('pages.paymentMethods.subtitle')}
        titleAdd={t('pages.paymentMethods.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.paymentMethodAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.paymentMethodEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide={false}
        showStatusInActions={true}
        onToggleStatus={handleToggleStatus}
        statusKey="status"
        renderCard={(row, { onEdit }) => {
          const name = getLocalizedText(row.name, locale);
          return (
            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
                  {row.icon ? (
                    <Image src={typeof row.icon === 'string' && !row.icon.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${row.icon}` : row.icon} alt={name} fill className="object-contain p-2" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-muted-foreground m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-[16px]">{name}</h3>
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
          );
        }}
        onDelete={(row) => setConfirmDeleteRow(row)}
      />

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.paymentMethods.delete')}
          description={t('pages.paymentMethods.deleteConfirm', { name: getLocalizedText(confirmDeleteRow.name, locale) })}
          onConfirm={async () => {
            await deleteMethod(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
