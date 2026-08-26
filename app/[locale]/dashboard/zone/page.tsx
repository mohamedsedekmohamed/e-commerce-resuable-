'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { zonesAdmin } from '@/services/zones';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { FileEdit, Trash2, Map } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { getLocalizedText, LocalizedText } from '../dashboard-utils';

interface Zone {
  id: number;
  name: LocalizedText;
  price: number;
  city: { id: number; name: LocalizedText };
  status: number | boolean;
}

export default function ZonesPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<Zone>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => {
        const name = getLocalizedText(row.name, locale);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <Map className="w-5 h-5 text-amber-500" />
            </div>
            <p className="font-medium text-foreground text-sm">{name}</p>
          </div>
        );
      },
    },
    {
      key: 'city',
      header: t('pages.zones.city'),
      render: (_, row) => {
        const catName = row.city ? getLocalizedText(row.city.name, locale) : '—';
        return <span className="text-sm text-muted-foreground">{catName}</span>;
      }
    },
    {
      key: 'price',
      header: t('pages.zones.price'),
      render: (_, row) => (
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          {row.price}
        </span>
      )
    },
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(zonesAdmin.getZones, locale);
  const { execute: deleteZone } = useApiAction(zonesAdmin.deleteZone, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus } = useApiAction(zonesAdmin.changeZoneStatus, { showSuccessToast: true });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Zone | null>(null);

  const response = data ?? null;
  const rows: Zone[] = response?.data?.data ?? response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  const handleToggleStatus = async (row: Zone) => {
    const newStatus = (row.status === 1 || row.status === true) ? false : true;
    await toggleStatus(row.id, newStatus);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<Zone>
        title={t('pages.zones.title')}
        subtitle={t('pages.zones.subtitle')}
        titleAdd={t('pages.zones.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.zoneAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.zoneEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide={false}
        showStatusInActions={true}
        onToggleStatus={handleToggleStatus}
        statusKey="status"
        renderCard={(row, { onEdit }) => {
          const name = getLocalizedText(row.name, locale);
          const cityName = row.city ? getLocalizedText(row.city.name, locale) : '—';
          return (
            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Map className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-[16px]">{name}</h3>
                    <p className="text-[13px] text-muted-foreground truncate">{cityName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[16px] text-emerald-600 block">{row.price}</span>
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
          title={t('pages.zones.delete')}
          description={t('pages.zones.deleteConfirm', { name: getLocalizedText(confirmDeleteRow.name, locale) })}
          onConfirm={async () => {
            await deleteZone(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
