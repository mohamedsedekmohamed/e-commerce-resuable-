'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { adminsAdmin } from '@/services/admins';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Mail, Phone, Calendar, Trash2, FileEdit } from 'lucide-react';
interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AdminsResponse {
  success: boolean;
  data: Admin[];
}

const fmt = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};


export default function AdminsPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');

  const columns: TableColumn<Admin>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden relative">
            <span className="text-primary text-xs font-bold">
              {row.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground truncate max-w-[200px] text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: t('table.phone') },
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(
    adminsAdmin.getAdmins,
    locale
  );

  const { execute: deleteAdmin }  = useApiAction(adminsAdmin.deleteAdmin, { successMsg: tForm('successDelete') });
  const [confirmDeleteRow,  setConfirmDeleteRow]  = useState<Admin | null>(null);
  const [viewId,            setViewId]            = useState<number | null>(null);

  const response: AdminsResponse | null = data ?? null;
  const rows: Admin[] = response?.data     ?? [];

  // ─── Page skeleton (first load only) ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={7} />
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">

      {/* Table — isFetching shows table-level loading overlay */}
      <ReusableTable<Admin>
        title={t('pages.admins.title')}
        subtitle={t('pages.admins.subtitle')}
        titleAdd={t('pages.admins.addTitle')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.adminAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.adminEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide={false}
        hasSearch={false}
        renderCard={(row, { onEdit }) => (
          <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
            <div className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-[16px]">{row.name}</h3>
                <p className="text-[13px] text-muted-foreground truncate">{row.email}</p>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-4 h-4 opacity-70" />
                <span className="truncate">{row.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-4 h-4 opacity-70" />
                <span className="truncate">{fmt(row.created_at)}</span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-1.5 bg-background">
              {onEdit && (
                <button onClick={() => onEdit(row)} className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors cursor-pointer text-muted-foreground" title={t('table.edit')}>
                  <FileEdit className="w-[18px] h-[18px]" />
                </button>
              )}
              <button onClick={() => setConfirmDeleteRow(row)} className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-red-500" title={t('table.delete')}>
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

      {/* View Modal */}
      {viewId !== null && (
        <ViewModal
          onClose={() => setViewId(null)}
          fetchConfig={async () => {
            const res = await adminsAdmin.getAdmin(viewId, locale);
            const a   = res.data;
            return {
              title: t('pages.admins.adminDetails'),
              avatar: { fallback: a.name?.charAt(0).toUpperCase() ?? '?' },
              fields: [
                { icon: <Mail    className="w-4 h-4" />, label: t('table.email'),          value: a.email },
                { icon: <Phone   className="w-4 h-4" />, label: t('table.phone'),          value: a.phone },
                { icon: <Calendar className="w-4 h-4" />, label: t('table.created'),       value: fmt(a.created_at) },
                { icon: <Calendar className="w-4 h-4" />, label: t('table.lastUpdated'),  value: fmt(a.updated_at) },
              ],
            };
          }}
        />
      )}

      {/* Delete Confirm */}
      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.admins.deleteAdmin')}
          description={t('pages.admins.deleteConfirm', { name: confirmDeleteRow.name })}
          onConfirm={async () => {
            await deleteAdmin(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
