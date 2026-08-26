'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { paymentMethodsAdmin } from '@/services/paymentMethods';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../dashboard-utils';

export default function AddPaymentMethodPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const { execute: addMethod } = useApiAction(paymentMethodsAdmin.addPaymentMethod, {
    showSuccessToast: true,
    successMsg: tForm('successAdd'),
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
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.media'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'status',
      label: t('table.active'),
      type: 'switch',
      defaultValue: true,
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

    const result = await addMethod(formData);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.paymentMethods.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
