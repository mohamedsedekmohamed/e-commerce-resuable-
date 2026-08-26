'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { couponsAdmin } from '@/services/coupons';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

function toDateValue(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  return typeof value === 'string' && value.length > 0 ? value : null;
}

const toCouponType = (value: unknown) => {
  if (value === 'percentage') return 'precentage';
  if (value === 'fixed') return 'value';
  return value;
};

const toDate = (value: unknown): Date | undefined => {
  if (value instanceof Date) return value;
  if (typeof value !== 'string') return undefined;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export default function EditCouponPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: coupon, isLoading: fetching } = useApiGet(couponsAdmin.getCoupon, id, locale);

  const { execute: updateCoupon } = useApiAction(couponsAdmin.updateCoupon, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });

  const fields: Field[] = [
    {
      name: 'name_en',
      label: t('form.nameEn'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'name_ar',
      label: t('form.nameAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'code',
      label: t('pages.coupons.code'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'type',
      label: t('pages.coupons.type'),
      type: 'select',
      options: [
        { value: 'precentage', label: t('pages.coupons.percentage') },
        { value: 'value', label: t('pages.coupons.value') }
      ],
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'discount',
      label: t('pages.coupons.discount'),
      type: 'numberdecimal',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'max_discount',
      label: t('pages.coupons.maxDiscount'),
      type: 'numberdecimal',
      required: false,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'from',
      label: t('pages.coupons.from'),
      type: 'date',
      required: false,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'to',
      label: t('pages.coupons.to'),
      type: 'date',
      required: false,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'usage_limit',
      label: t('pages.coupons.usageLimit'),
      type: 'number',
      required: false,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'user_usage_limit',
      label: t('pages.coupons.userUsageLimit'),
      type: 'number',
      required: false,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    }
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const payload = {
      name: {
        en: String(data.name_en ?? ''),
        ar: String(data.name_ar ?? ''),
      },
      code: String(data.code ?? ''),
      discount: String(data.discount ?? ''),
      type: String(data.type ?? ''),
      usage_limit: data.usage_limit || null,
      user_usage_limit: data.user_usage_limit || null,
      max_discount: data.max_discount || null,
      from: toDateValue(data.from),
      to: toDateValue(data.to),
    };

    const result = await updateCoupon(id, payload);
    if (result.success) {
      router.back();
    }
  };

  const cData = coupon;

  const initialData = cData ? {
    ...cData,
    name_en: cData.name?.en || (typeof cData.name === 'string' ? cData.name : ''),
    name_ar: cData.name?.ar || (typeof cData.name === 'string' ? cData.name : ''),
    type: toCouponType(cData.type),
    from: toDate(cData.from ?? cData.valid_from),
    to: toDate(cData.to ?? cData.valid_to),
    user_usage_limit: cData.user_usage_limit ?? cData.user_limit,
  } : undefined;

  return (
    <AddPage
      title={t('pages.coupons.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
