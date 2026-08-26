'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { servicesAdmin } from '@/services/service';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Eye, FileEdit, Trash2, Briefcase } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
import { getLocalizedText, LocalizedText } from '../dashboard-utils';

interface Service {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  image: string | null;
}

export default function ServicesPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => {
        const name = getLocalizedText(row.name, locale);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
              {row.image ? (
                <Image src={typeof row.image === 'string' && !row.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${row.image}` : row.image} alt={name} fill className="object-cover" />
              ) : (
                <Briefcase className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-foreground text-sm truncate max-w-[200px]">{name}</p>
          </div>
        );
      },
    },
    {
      key: 'description',
      header: t('table.description'),
      render: (_, row) => {
        const desc = getLocalizedText(row.description, locale);
        return <p className="text-sm text-muted-foreground max-w-[250px] truncate">{desc}</p>;
      }
    }
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(servicesAdmin.getServices);
  const { execute: deleteService } = useApiAction(servicesAdmin.deleteService, { successMsg: tForm('successDelete') });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Service | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const response = data ?? null;
  const rows: Service[] = response?.data?.data ?? response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={6} cols={3} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<Service>
        title={t('pages.services.title')}
        subtitle={t('pages.services.subtitle')}
        titleAdd={t('pages.services.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.addservice}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.serviceEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide={false}
        renderCard={(row, { onEdit }) => {
          const name = getLocalizedText(row.name, locale);
          const desc = getLocalizedText(row.description, locale);
          return (
            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative border border-border">
                  {row.image ? (
                    <Image src={typeof row.image === 'string' && !row.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${row.image}` : row.image} alt={name} fill className="object-cover" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-muted-foreground m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-[16px]">{name}</h3>
                  <p className="text-[13px] text-muted-foreground line-clamp-2 mt-1">{desc}</p>
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
            const res = await servicesAdmin.getService(viewId);
            const c = res.data;
            const name = typeof c.name === 'object' ? (c.name[locale] || c.name.en) : c.name;
            const desc = typeof c.description === 'object' ? (c.description[locale] || c.description.en) : c.description;
            return {
              title: t('pages.services.details'),
              avatar: { src: c.image && !c.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${c.image}` : c.image, fallback: name?.charAt(0) ?? '?' },
              fields: [
                { label: t('table.name'), value: name },
                { label: t('table.description'), value: desc },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.services.delete')}
          description={t('pages.services.deleteConfirm', { name: getLocalizedText(confirmDeleteRow.name, locale) })}
          onConfirm={async () => {
            await deleteService(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
