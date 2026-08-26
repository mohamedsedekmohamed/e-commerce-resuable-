'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useApiGet } from '@/hooks/useApi';
import { dashboardAdmin } from '@/services/dashboard';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import {
  ShoppingBag,
  Tag,
  Users,
  TrendingUp,
  BarChart3,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { getLocalizedText, LocalizedText } from './dashboard-utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyOrder {
  month: number;
  orders_count: number;
  orders_total: number;
}

interface BestProduct {
  id: number | string;
  product: LocalizedText;
  count: number;
}

interface DashboardStats {
  monthly_orders?: MonthlyOrder[];
  best_products?: BestProduct[];
  products?: number;
  categories?: number;
  users?: number;
  year?: number | string;
}

export default function DashboardPage() {
  const locale = useLocale();
  const t = useTranslations('admin');

  const { data, isLoading } = useApiGet(dashboardAdmin.getStats);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  const stats = (data?.data || data || {}) as DashboardStats;
  const monthlyOrders = (stats.monthly_orders || []).map((m) => ({
    ...m,
    monthName: MONTHS[m.month - 1] || `M${m.month}`,
  }));
  const bestProducts = stats.best_products || [];

  const statCards = [
    {
      label: t('pages.products.title'),
      value: stats.products ?? 0,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: t('pages.categories.title'),
      value: stats.categories ?? 0,
      icon: Tag,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: t('sidebar.users'),
      value: stats.users ?? 0,
      icon: Users,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      label: t('sidebar.orders'),
      value: monthlyOrders.reduce((total, month) => total + month.orders_count, 0),
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {t('sidebar.dashboard')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {stats.year && `${t('sidebar.dashboard')} — ${stats.year}`}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {Number(card.value).toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t('sidebar.orders')} — {t('table.total')}</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
                <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border, #e5e7eb)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="orders_count" fill="var(--color-primary, #6366f1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-foreground">{t('table.total')} — {t('table.price')}</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
                <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--color-border, #e5e7eb)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders_total"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best Products */}
      {bestProducts.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-foreground">{t('pages.products.title')} — Top</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestProducts.map((p, i) => (
              <div
                key={p.id || `best-product-${i}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">#{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-sm">
                    {getLocalizedText(p.product, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.count} {t('sidebar.orders')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
