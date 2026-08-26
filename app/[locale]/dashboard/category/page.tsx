'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { categoriesAdmin } from '@/services/categories';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Eye, FileEdit, Trash2, Image as ImageIcon } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
import { getLocalizedText, LocalizedText } from '../dashboard-utils';
import { PaginatedResponse } from '@/types/pagination.interface';

interface Category {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  image: string | null;
  image_url?: string | null;
  status: number | boolean;
}

function getCategoryImageUrl(category: Pick<Category, 'image' | 'image_url'>) {
  const image = category.image_url ?? category.image;
  if (!image || image.startsWith('http')) return image;

  return `https://ecommerce.mazoom.online/storage/${image}`;
}

export default function CategoriesPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      header: t('table.name'),
      render: (_, row) => {
        const name = getLocalizedText(row.name, locale);
        const imageUrl = getCategoryImageUrl(row);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
              {imageUrl ? (
                <Image src={imageUrl} alt={name} fill className="object-cover" />
              ) : (
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-foreground text-sm">{name}</p>
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

  const { data, isLoading, isFetching, refetch } = useApiGet(
    categoriesAdmin.getCategories,
    locale,
    { page, search: search || undefined },
  );
  const { execute: deleteCategory } = useApiAction(categoriesAdmin.deleteCategory, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus } = useApiAction(categoriesAdmin.changeCategoryStatus, { showSuccessToast: true });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Category | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const response = data as PaginatedResponse<Category> | null;
  const rows = response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  const handleToggleStatus = async (row: Category) => {
    const newStatus = (row.status === 1 || row.status === true) ? false : true;
    await toggleStatus(row.id, newStatus);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<Category>
        title={t('pages.categories.title')}
        subtitle={t('pages.categories.subtitle')}
        titleAdd={t('pages.categories.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.categoryAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.categoryEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={response?.current_page ?? page}
        serverTotalPages={response?.last_page ?? 1}
        serverTotalItems={response?.total ?? 0}
        rowsPerPage={response?.per_page ?? 15}
        onServerPageChange={setPage}
        onServerSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        showStatusInActions={true}
        onToggleStatus={handleToggleStatus}
        statusKey="status"
        renderCard={(row, { onEdit }) => {
          const name = getLocalizedText(row.name, locale);
          const desc = getLocalizedText(row.description, locale);
          const imageUrl = getCategoryImageUrl(row);
          return (
            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted shrink-0 relative overflow-hidden">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={name} fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground m-auto mt-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-[16px]">{name}</h3>
                  <p className="text-[13px] text-muted-foreground truncate">{desc}</p>
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
            const res = await categoriesAdmin.getCategory(viewId, locale);
            const c = res.data;
            const name = typeof c.name === 'object' ? (c.name[locale] || c.name.en) : c.name;
            const desc = typeof c.description === 'object' ? (c.description[locale] || c.description.en) : c.description;
            return {
              title: t('pages.categories.details'),
              avatar: { src: c.image && !c.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${c.image}` : c.image, fallback: name?.charAt(0) ?? '?' },
              fields: [
                { label: t('table.name'), value: name },
                { label: t('table.description'), value: desc },
                { label: t('table.active'), value: c.status ? t('table.active') : t('table.inactive'), badge: c.status ? 'success' : 'danger' },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.categories.delete')}
          description={t('pages.categories.deleteConfirm', { name: getLocalizedText(confirmDeleteRow.name, locale) })}
          onConfirm={async () => {
            await deleteCategory(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
