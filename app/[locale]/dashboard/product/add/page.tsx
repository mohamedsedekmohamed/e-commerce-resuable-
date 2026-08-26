'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { productsAdmin } from '@/services/products';
import { categoriesAdmin, CategoryListItem } from '@/services/categories';
import { useLocale, useTranslations } from 'next-intl';
import GalleryUploader from '@/components/shared/form/fields/GalleryUploader';
import VariationsBuilder from '@/components/shared/form/fields/VariationsBuilder';
import { DashboardFormValues, getLocalizedText } from '../../dashboard-utils';

interface ProductVariationOption {
  name_en?: string;
  name_ar?: string;
  price?: number | string;
}

interface ProductVariation {
  name_en?: string;
  name_ar?: string;
  options?: ProductVariationOption[];
}

type GalleryValue = File | string;

interface VariationBuilderOption {
  name_en: string;
  name_ar: string;
  price: number;
}

interface VariationBuilderVariation {
  name_en: string;
  name_ar: string;
  options: VariationBuilderOption[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProductVariationOption(value: unknown): value is ProductVariationOption {
  return isRecord(value)
    && (value.name_en === undefined || typeof value.name_en === 'string')
    && (value.name_ar === undefined || typeof value.name_ar === 'string')
    && (value.price === undefined || typeof value.price === 'number' || typeof value.price === 'string');
}

function isProductVariation(value: unknown): value is ProductVariation {
  return isRecord(value)
    && (value.name_en === undefined || typeof value.name_en === 'string')
    && (value.name_ar === undefined || typeof value.name_ar === 'string')
    && (value.options === undefined || (
      Array.isArray(value.options) && value.options.every(isProductVariationOption)
    ));
}

function isGalleryValue(value: unknown): value is GalleryValue {
  return value instanceof File || typeof value === 'string';
}

function toGalleryValues(value: unknown): GalleryValue[] {
  return Array.isArray(value) ? value.filter(isGalleryValue) : [];
}

function isVariationBuilderOption(value: unknown): value is VariationBuilderOption {
  return isRecord(value)
    && typeof value.name_en === 'string'
    && typeof value.name_ar === 'string'
    && typeof value.price === 'number';
}

function isVariationBuilderVariation(value: unknown): value is VariationBuilderVariation {
  return isRecord(value)
    && typeof value.name_en === 'string'
    && typeof value.name_ar === 'string'
    && Array.isArray(value.options)
    && value.options.every(isVariationBuilderOption);
}

function toVariationBuilderValues(value: unknown): VariationBuilderVariation[] {
  return Array.isArray(value) && value.every(isVariationBuilderVariation) ? value : [];
}

export default function AddProductPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');

  // Fetch categories for the dropdown
  const { data: categoriesRes } = useApiGet(categoriesAdmin.getCategoriesList, locale);
  const categoriesList: CategoryListItem[] = Array.isArray(categoriesRes) ? categoriesRes : [];
  const categoryOptions = categoriesList.map((c) => ({
    value: c.id,
    label: getLocalizedText(c.name, locale)
  }));

  const { execute: addProduct } = useApiAction(productsAdmin.addProduct, {
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
      section: t('pages.products.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'name_ar',
      label: t('form.nameAr'),
      type: 'text',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_en',
      label: t('form.descEn'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'description_ar',
      label: t('form.descAr'),
      type: 'textarea',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.general'),
      sectionOrder: 1,
      sidebar: false,
    },
    {
      name: 'price',
      label: t('form.price'),
      type: 'number',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'discount_from',
      label: t('form.discountFrom'),
      type: 'datetime',
      required: false,
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'discount_to',
      label: t('form.discountTo'),
      type: 'datetime',
      required: false,
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'discount',
      label: t('form.discount'),
      type: 'number',
      required: false,
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'category_id',
      label: t('pages.categories.titleAdd'),
      type: 'select',
      options: categoryOptions,
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'is_parent',
      label: t('pages.products.isParent'),
      type: 'switch',
      defaultValue: true,
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'image',
      label: t('form.image'),
      type: 'file',
      required: true,
      requiredMessage: tForm('required'),
      section: t('pages.products.tabs.media'),
      sectionOrder: 3,
      sidebar: false,
    },
    {
      name: 'status',
      label: t('table.active'),
      type: 'switch',
      defaultValue: true,
      section: t('pages.products.tabs.media'),
      sectionOrder: 3,
      sidebar: false,
    },
    {
      name: 'gallery',
      label: t('pages.products.galleryTitle'),
      type: 'custom',
      section: t('pages.products.tabs.media'),
      sectionOrder: 3,
      sidebar: false,
      render: ({ value, onChange, error, field }) => (
        <GalleryUploader
          value={toGalleryValues(value)}
          onChange={onChange}
          error={error}
          field={field}
          tForm={tForm}
        />
      ),
    },
    {
      name: 'variations',
      label: t('pages.products.variationsTitle'),
      type: 'custom',
      section: t('pages.products.tabs.variations'),
      sectionOrder: 4,
      sidebar: false,
      fullWidth: true,
      render: ({ value, onChange, error, field }) => (
        <VariationsBuilder
          value={toVariationBuilderValues(value)}
          onChange={onChange}
          error={error}
          field={field}
        />
      ),
    }
  ];

  const handleSave = async (data: DashboardFormValues) => {
    const formData = new FormData();
    formData.append('name[en]', String(data.name_en ?? ''));
    formData.append('name[ar]', String(data.name_ar ?? ''));
    formData.append('description[en]', String(data.description_en ?? ''));
    formData.append('description[ar]', String(data.description_ar ?? ''));
    formData.append('price', String(data.price ?? ''));
    if (data.discount_from) formData.append('discount_from', String(data.discount_from));
    if (data.discount_to) formData.append('discount_to', String(data.discount_to));
    if (data.discount) formData.append('discount', String(data.discount));
    formData.append('category_id', String(data.category_id ?? ''));
    formData.append('is_parent', Boolean(data.is_parent) ? '1' : '0');
    formData.append('status', Boolean(data.status) ? '1' : '0');

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    if (Array.isArray(data.gallery)) {
      data.gallery.filter((file): file is File => file instanceof File).forEach((file, index) => {
        formData.append(`gallery[${index}]`, file);
      });
    }

    if (Array.isArray(data.variations)) {
      data.variations.filter(isProductVariation).forEach((variation, vIndex) => {
        if (variation.name_en) formData.append(`variations[${vIndex}][name][en]`, variation.name_en);
        if (variation.name_ar) formData.append(`variations[${vIndex}][name][ar]`, variation.name_ar);
        
        if (variation.options && Array.isArray(variation.options)) {
          variation.options.filter(isProductVariationOption).forEach((option, oIndex) => {
            if (option.name_en) formData.append(`variations[${vIndex}][options][${oIndex}][name][en]`, option.name_en);
            if (option.name_ar) formData.append(`variations[${vIndex}][options][${oIndex}][name][ar]`, option.name_ar);
            formData.append(`variations[${vIndex}][options][${oIndex}][price]`, String(option.price ?? 0));
          });
        }
      });
    }

    const result = await addProduct(formData);
    if (result.success) {
      router.back();
    }
  };

  return (
    <AddPage
      title={t('pages.products.addTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
