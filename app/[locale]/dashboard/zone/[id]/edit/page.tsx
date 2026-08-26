'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { zonesAdmin } from '@/services/zones';
import { citiesAdmin } from '@/services/cities';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues, getLocalizedText, LocalizedText } from '../../../dashboard-utils';

interface CityOption {
  id: number;
  name: LocalizedText;
}

export default function EditZonePage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: citiesRes } = useApiGet(citiesAdmin.getCitiesList, locale);
  const citiesList = (citiesRes || []) as CityOption[];
  const cityOptions = citiesList.map((c) => ({
    value: c.id,
    label: getLocalizedText(c.name, locale)
  }));

  const { data: zone, isLoading: fetching } = useApiGet(zonesAdmin.getZone, id, locale);

  const { execute: updateZone } = useApiAction(zonesAdmin.updateZone, {
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

    const result = await updateZone(id, payload);
    if (result.success) {
      router.back();
    }
  };

  const zData = zone;

  const initialData = zData ? {
    name_en: typeof zData.name === 'object' ? (zData.name.en || '') : zData.name,
    name_ar: typeof zData.name === 'object' ? (zData.name.ar || '') : zData.name,
    price: zData.price,
    city_id: zData.city?.id || zData.city_id,
    status: zData.status === 1 || zData.status === true,
  } : undefined;

  return (
    <AddPage
      title={t('pages.zones.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
    />
  );
}
