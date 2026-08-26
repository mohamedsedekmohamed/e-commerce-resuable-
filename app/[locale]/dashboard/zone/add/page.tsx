'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { zonesAdmin } from '@/services/zones';
import { citiesAdmin } from '@/services/cities';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues, getLocalizedText, LocalizedText } from '../../dashboard-utils';

interface CityOption {
  id: number;
  name: LocalizedText;
}

export default function AddZonePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  const { data: citiesRes } = useApiGet(citiesAdmin.getCitiesList, locale);
  const citiesList = (citiesRes || []) as CityOption[];
  const cityOptions = citiesList.map((c) => ({
    value: c.id,
    label: getLocalizedText(c.name, locale)
  }));

  const { execute: addZone } = useApiAction(zonesAdmin.addZone, {
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
      name: 'price',
      label: t('pages.zones.price'),
      type: 'numberdecimal',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'city_id',
      label: t('pages.zones.city'),
      type: 'select',
      options: cityOptions,
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
      price: data.price,
      city_id: data.city_id,
      status: Boolean(data.status) ? 1 : 0
    };

    const result = await addZone(payload);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.zones.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
