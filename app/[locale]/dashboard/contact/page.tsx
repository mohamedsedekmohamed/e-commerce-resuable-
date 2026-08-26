'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, CheckCircle, Eye, Mail, Phone } from 'lucide-react';
import ReusableTable, { TableColumn } from '@/components/shared/ReusableTable';
import ViewModal from '@/components/shared/ViewModal';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { contactAdmin } from '@/services/contact';
import { ContactMessage } from '@/types/contact.interface';

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const fullName = (message: ContactMessage) =>
  [message.f_name, message.l_name].filter(Boolean).join(' ') || '—';

const isUnread = (message: ContactMessage) => message.status === 0 || message.status === false;

export default function ContactPage() {
  const t = useTranslations('admin');
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [newPage, setNewPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

  const newRequest = useApiGet(contactAdmin.getContact, { page: newPage });
  const historyRequest = useApiGet(contactAdmin.getHistory, { page: historyPage });
  const { execute: readMessage, isLoading: isMarkingRead } = useApiAction(contactAdmin.markAsRead, {
    showSuccessToast: false,
  });

  const activeRequest = tab === 'new' ? newRequest : historyRequest;
  const pagination = activeRequest.data?.data;
  const rows = pagination?.data ?? [];
  const activePage = tab === 'new' ? newPage : historyPage;

  const markAsRead = async (message: ContactMessage) => {
    if (!isUnread(message)) return;

    const result = await readMessage(message.id);
    if (result.success) {
      await Promise.all([newRequest.refetch(), historyRequest.refetch()]);
    }
  };

  const columns: TableColumn<ContactMessage>[] = [
    {
      key: 'f_name',
      header: t('table.name'),
      render: (_, row) => (
        <div>
          <p className="font-medium text-foreground text-sm">{fullName(row)}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: t('pages.contact.phone') },
    {
      key: 'content',
      header: t('pages.contact.message'),
      render: (_, row) => (
        <div className="max-w-[240px]">
          <p className="text-sm font-medium text-foreground truncate">{row.title}</p>
          <p className="text-sm text-muted-foreground truncate">{row.content}</p>
        </div>
      ),
    },
    {
      key: 'created_at',
      header: t('table.created'),
      render: (_, row) => <span className="text-sm text-muted-foreground">{formatDate(row.created_at)}</span>,
    },
  ];

  const changePage = (page: number) => {
    if (tab === 'new') setNewPage(page);
    else setHistoryPage(page);
  };

  if (activeRequest.isLoading) {
    return <div className="p-6"><TableSkeleton rows={6} cols={4} /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 border-b border-border">
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${tab === 'new' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('new')}
        >
          {t('pages.contact.tabs.messages')} ({newRequest.data?.data.total ?? 0})
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${tab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setTab('history')}
        >
          {t('pages.contact.tabs.history')} ({historyRequest.data?.data.total ?? 0})
        </button>
      </div>

      <ReusableTable<ContactMessage>
        title={tab === 'new' ? t('pages.contact.tabs.messages') : t('pages.contact.tabs.history')}
        subtitle={t('pages.contact.subtitle')}
        columns={columns}
        data={rows}
        isLoading={activeRequest.isFetching}
        isServerSide
        serverCurrentPage={pagination?.current_page ?? activePage}
        serverTotalPages={pagination?.last_page ?? 1}
        serverTotalItems={pagination?.total ?? 0}
        rowsPerPage={pagination?.per_page ?? 10}
        onServerPageChange={changePage}
        hasSearch={false}
        extraActions={(row) => (
          <>
            {isUnread(row) && (
              <button
                type="button"
                title={t('pages.contact.markAsRead')}
                disabled={isMarkingRead}
                onClick={() => void markAsRead(row)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-60"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              title={t('table.view')}
              onClick={() => {
                setViewMessage(row);
                void markAsRead(row);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10"
            >
              <Eye className="w-4 h-4" />
            </button>
          </>
        )}
        renderCard={(row) => (
          <div className={`flex flex-col border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden ${isUnread(row) ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}>
            <div className="p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUnread(row) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate text-[16px]">{fullName(row)}</h3>
                <p className="text-[13px] text-muted-foreground truncate">{row.email}</p>
              </div>
              {isUnread(row) && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white uppercase tracking-wider">{t('pages.contact.unread')}</span>}
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/20">
              <p className="text-sm font-medium text-foreground truncate">{row.title}</p>
              <p className="line-clamp-2 text-[13px] text-muted-foreground">{row.content}</p>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-1.5 bg-background">
              {isUnread(row) && (
                <button
                  type="button"
                  disabled={isMarkingRead}
                  onClick={() => void markAsRead(row)}
                  className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('pages.contact.markAsRead')}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setViewMessage(row);
                  void markAsRead(row);
                }}
                className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('table.view')}
              </button>
            </div>
          </div>
        )}
      />

      {viewMessage && (
        <ViewModal
          onClose={() => setViewMessage(null)}
          fetchConfig={async () => ({
            title: t('pages.contact.title'),
            avatar: { fallback: fullName(viewMessage).charAt(0) || '?' },
            subtitle: { label: viewMessage.title, badge: false },
            fields: [
              { icon: <Mail className="w-4 h-4" />, label: t('table.email'), value: viewMessage.email },
              { icon: <Phone className="w-4 h-4" />, label: t('pages.contact.phone'), value: viewMessage.phone },
              { icon: <Calendar className="w-4 h-4" />, label: t('table.created'), value: formatDate(viewMessage.created_at) },
              { label: t('pages.contact.message'), value: viewMessage.content },
            ],
          })}
        />
      )}
    </div>
  );
}
