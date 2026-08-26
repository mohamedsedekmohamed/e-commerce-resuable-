'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { categoriesAdmin } from '@/services/categories';
import { useLocale, useTranslations } from 'next-intl';
import { DashboardFormValues } from '../../../dashboard-utils';

export default function EditCategoryPage() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const params = useParams();
  const id = params.id as string;

  const { data: category, isLoading: fetching } = useApiGet(categoriesAdmin.getCategory, id, locale);
  const { data: categories } = useApiGet(categoriesAdmin.getCategoriesList, locale);
  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: locale === 'ar'
      ? category.name.ar ?? category.name.en ?? String(category.id)
      : category.name.en ?? category.name.ar ?? String(category.id),
  })) ?? [];

  const { execute: updateCategory } = useApiAction(categoriesAdmin.updateCategory, {
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
      name: 'category_id',
      label: t('pages.categories.parentCategory'),
      placeholder: t('pages.categories.parentCategoryPlaceholder'),
      type: 'select',
      options: categoryOptions,
      section: t('pages.categories.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'image',
      label: t('form.image'),
      type: 'file',
      required: true,
      requiredMessage: tForm('required')  ,
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
    if (typeof data.category_id === 'string' || typeof data.category_id === 'number') {
      formData.append('category_id', String(data.category_id));
    }
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    formData.append('status', Boolean(data.status) ? '1' : '0');

    const result = await updateCategory(id, formData);
    if (result.success) {
      router.back();
    }
  };

  const catData = category;

  const initialData = catData ? {
    name_en: catData.name?.en ?? catData.name ?? '',
    name_ar: catData.name?.ar ?? catData.name ?? '',
    description_en: catData.description?.en ?? catData.description ?? '',
    description_ar: catData.description?.ar ?? catData.description ?? '',
    category_id: catData.category_id ?? '',
    status: catData.status === 1 || catData.status === true,
    image: catData.image && !String(catData.image).startsWith('http') 
      ? `https://ecommerce.mazoom.online/storage/${catData.image}` 
      : catData.image,
  } : undefined;

  return (
    <AddPage
      title={t('pages.categories.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching}
      initialData={initialData}
      isEdit={true}
    />
  );
}
