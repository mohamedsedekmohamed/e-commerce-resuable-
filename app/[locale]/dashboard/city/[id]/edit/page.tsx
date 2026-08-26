'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { citiesAdmin } from '@/services/cities';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

export default function EditCityPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: city, isLoading: fetching } = useApiGet(citiesAdmin.getCity, id, locale);

  const { execute: updateCity } = useApiAction(citiesAdmin.updateCity, {
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
      name: 'status',
      label: t('table.active'),
      type: 'switch',
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

    const result = await updateCity(id, payload);
    if (result.success) {
      router.back();
    }
  };

  const cData = city;

  const initialData = cData ? {
    name_en: typeof cData.name === 'object' ? (cData.name.en || '') : cData.name,
    name_ar: typeof cData.name === 'object' ? (cData.name.ar || '') : cData.name,
    status: cData.status === 1 || cData.status === true,
  } : undefined;

  return (
    <AddPage
      title={t('pages.cities.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
