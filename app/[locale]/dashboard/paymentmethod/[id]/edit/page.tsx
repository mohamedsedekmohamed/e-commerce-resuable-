'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { paymentMethodsAdmin } from '@/services/paymentMethods';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: method, isLoading: fetching } = useApiGet(paymentMethodsAdmin.getPaymentMethod, id, locale);

  const { execute: updateMethod } = useApiAction(paymentMethodsAdmin.updatePaymentMethod, {
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
      name: 'description_en',
      label: t('form.descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
      fullWidth: true,
    },
    {
      name: 'description_ar',
      label: t('form.descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
      fullWidth: true,
    },
    {
      name: 'icon',
      label: t('pages.paymentMethods.icon'),
      type: 'file',
      required: false,
      section: t('pages.categories.tabs.media'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'status',
      label: t('table.active'),
      type: 'switch',
      section: t('pages.categories.tabs.media'),
      sectionOrder: 2,
      sidebar: false,
    }
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const formData = new FormData();
    formData.append('name[en]', String(data.name_en ?? ''));
    formData.append('name[ar]', String(data.name_ar ?? ''));
    formData.append('description[en]', String(data.description_en ?? ''));
    formData.append('description[ar]', String(data.description_ar ?? ''));
    if (data.icon instanceof File) {
      formData.append('icon', data.icon);
    }
    formData.append('status', Boolean(data.status) ? '1' : '0');

    const result = await updateMethod(id, formData);
    if (result.success) {
      router.back();
    }
  };

  const mData = method;

  const initialData = mData ? {
    name_en: typeof mData.name === 'object' ? (mData.name.en || '') : mData.name,
    name_ar: typeof mData.name === 'object' ? (mData.name.ar || '') : mData.name,
    description_en: typeof mData.description === 'object' ? (mData.description.en || '') : mData.description,
    description_ar: typeof mData.description === 'object' ? (mData.description.ar || '') : mData.description,
    status: mData.status === 1 || mData.status === true,
    icon: mData.icon && !mData.icon.startsWith('http') ? `https://ecommerce.mazoom.online/storage/${mData.icon}` : mData.icon,
  } : undefined;

  return (
    <AddPage
      title={t('pages.paymentMethods.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
