'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import { productsAdmin } from '@/services/products';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { useState } from 'react';
import { Eye, FileEdit, Trash2, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';
import ROUTES from '@/core/manager/route.manager';
import ConfirmDelete from '@/components/shared/ConfirmDelete';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import Image from 'next/image';
import { getLocalizedText, LocalizedText } from '../dashboard-utils';

interface Product {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  price: string | number;
  discount: number;
  category: { id: number; name: LocalizedText };
  image: string | null;
  status: number | boolean;
}

export default function ProductsPage() {
  const locale = useLocale();
  const router = useRouter();
  const tForm = useTranslations('admin.form');
  const t = useTranslations('admin');
  const [page, setPage] = useState(1);

  const columns: TableColumn<Product>[] = [
    {
      key: 'product',
      header: t('table.name'),
      render: (_, row) => {
        const name = getLocalizedText(row.name, locale);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
              {row.image ? (
                <Image src={typeof row.image === 'string' && !row.image.startsWith('http')
                   ? `https://ecommerce.mazoom.online/storage/${row.image}` :
                    row.image} alt={name || 'Product'} fill className="object-cover" />
              ) : (
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-foreground text-sm truncate max-w-[200px]">{name}</p>
          </div>
        );
      },
    },
    {
      key: 'price',
      header: t('table.price'),
      render: (_, row) => (
        <span className="font-semibold text-primary">{row.price}</span>
      )
    },
    {
      key: 'category',
      header: t('pages.categories.titleAdd'),
      render: (_, row) => {
        const catName = row.category ? getLocalizedText(row.category.name, locale) : '—';
        return <span className="text-sm text-muted-foreground">{catName}</span>;
      }
    }
  ];

  const { data, isLoading, isFetching, refetch } = useApiGet(productsAdmin.getProducts, locale, { page });
  const { execute: deleteProduct } = useApiAction(productsAdmin.deleteProduct, { successMsg: tForm('successDelete') });
  const { execute: toggleStatus } = useApiAction(productsAdmin.changeProductStatus, { showSuccessToast: true });

  const [confirmDeleteRow, setConfirmDeleteRow] = useState<Product | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const response = data ?? null;
  const rows: Product[] = response?.data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={8} cols={5} />
      </div>
    );
  }

  const handleToggleStatus = async (row: Product) => {
    const newStatus = (row.status === 1 || row.status === true) ? false : true;
    await toggleStatus(row.id, newStatus);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <ReusableTable<Product>
        title={t('pages.products.title')}
        subtitle={t('pages.products.subtitle')}
        titleAdd={t('pages.products.titleAdd')}
        onAddClick={() => router.push(`/${locale}${ROUTES.dashboard.productAdd}`)}
        onEdit={(row) => router.push(`/${locale}${ROUTES.dashboard.productEdit(row.id)}`)}
        columns={columns}
        data={rows}
        isLoading={isFetching}
        isServerSide
        serverCurrentPage={response?.current_page ?? page}
        serverTotalPages={response?.last_page ?? 1}
        serverTotalItems={response?.total ?? 0}
        rowsPerPage={response?.per_page ?? 15}
        onServerPageChange={setPage}
        showStatusInActions={true}
        onToggleStatus={handleToggleStatus}
        statusKey="status"
        renderCard={(row, { onEdit }) => {
          const name = getLocalizedText(row.name, locale);
          const catName = row.category ? getLocalizedText(row.category.name, locale) : '—';
          return (
            <div className="flex flex-col bg-card border border-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted shrink-0 relative overflow-hidden">
                  {row.image ? (
                    <Image src={typeof row.image === 'string' && !row.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${row.image}` : row.image} alt={name || 'Product'} fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground m-auto mt-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-[16px]">{name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-primary">{row.price}</span>
                    {row.discount > 0 && <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full">-{row.discount}%</span>}
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate">
                  <Tag className="w-4 h-4 opacity-70" />
                  <span className="truncate">{catName}</span>
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
            const res = await productsAdmin.getProduct(viewId, locale);
            const p = res.data;
            const name = getLocalizedText(p.name, locale);
            const desc = getLocalizedText(p.description, locale);
            const catName = p.category ? getLocalizedText(p.category.name, locale) : '—';
            return {
              title: t('pages.products.details'),
              avatar: { src: p.image && !p.image.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${p.image}` : p.image, fallback: name?.charAt(0) ?? '?' },
              fields: [
                { label: t('table.name'), value: name },
                { label: t('table.description'), value: desc },
                { icon: <DollarSign className="w-4 h-4"/>, label: t('table.price'), value: String(p.price) },
                { label: t('table.discount'), value: p.discount ? `${p.discount}%` : '—' },
                { icon: <Tag className="w-4 h-4"/>, label: t('pages.categories.titleAdd'), value: catName },
                { label: t('table.active'), value: p.status ? t('table.active') : t('table.inactive'), badge: p.status ? 'success' : 'danger' },
              ],
            };
          }}
        />
      )}

      {confirmDeleteRow && (
        <ConfirmDelete
          title={t('pages.products.delete')}
          description={t('pages.products.deleteConfirm', { name: getLocalizedText(confirmDeleteRow.name, locale) })}
          onConfirm={async () => {
            await deleteProduct(confirmDeleteRow.id);
            setConfirmDeleteRow(null);
            refetch();
          }}
          onCancel={() => setConfirmDeleteRow(null)}
        />
      )}
    </div>
  );
}
