'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApi';
import { citiesAdmin } from '@/services/cities';
import { useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../dashboard-utils';

export default function AddCityPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const { execute: addCity } = useApiAction(citiesAdmin.addCity, {
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
      name: 'status',
      label: t('table.active'),
      type: 'switch',
      defaultValue: true,
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
      status: Boolean(data.status) ? 1 : 0
    };

    const result = await addCity(payload);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.cities.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
