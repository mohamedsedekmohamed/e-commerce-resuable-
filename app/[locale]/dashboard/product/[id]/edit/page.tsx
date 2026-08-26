'use client';

import AddPage from '@/components/shared/AddPage';
import { Field } from '@/components/shared/form/FormTypes';
import { useRouter, useParams } from 'next/navigation';
import { useApiAction, useApiGet } from '@/hooks/useApi';
import { productsAdmin } from '@/services/products';
import { categoriesAdmin, CategoryListItem } from '@/services/categories';
import { useLocale, useTranslations } from 'next-intl';
import GalleryUploader from '@/components/shared/form/fields/GalleryUploader';
import VariationsBuilder from '@/components/shared/form/fields/VariationsBuilder';
import { TableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { DashboardFormValues, getLocalizedText } from '../../../dashboard-utils';

type ProductEntityId = string | number;

interface GalleryImage {
  id: ProductEntityId;
  image?: string | null;
  image_url?: string | null;
}

interface ProductVariationOption {
  id?: ProductEntityId;
  name_en: string;
  name_ar: string;
  price: number;
  deleted?: boolean;
}

interface ProductVariation {
  id?: ProductEntityId;
  name_en: string;
  name_ar: string;
  options: ProductVariationOption[];
  deleted?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProductEntityId(value: unknown): value is ProductEntityId {
  return typeof value === 'string' || typeof value === 'number';
}

function isGalleryImage(value: unknown): value is GalleryImage {
  return isRecord(value)
    && isProductEntityId(value.id)
    && (value.image === undefined || value.image === null || typeof value.image === 'string')
    && (value.image_url === undefined || value.image_url === null || typeof value.image_url === 'string');
}

function toGalleryImages(value: unknown): GalleryImage[] | undefined {
  return Array.isArray(value) && value.every(isGalleryImage) ? value : undefined;
}

function toProductVariations(value: unknown): ProductVariation[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((variation) => {
    if (!isRecord(variation)) return [];
    const name = isRecord(variation.name) ? variation.name : {};
    const options = Array.isArray(variation.options) ? variation.options.flatMap((option) => {
      if (!isRecord(option)) return [];
      const optionName = isRecord(option.name) ? option.name : {};
      const price = typeof option.price === 'number' ? option.price : Number(option.price);
      return [{
        ...(isProductEntityId(option.id) ? { id: option.id } : {}),
        name_en: typeof option.name_en === 'string' ? option.name_en : typeof optionName.en === 'string' ? optionName.en : '',
        name_ar: typeof option.name_ar === 'string' ? option.name_ar : typeof optionName.ar === 'string' ? optionName.ar : '',
        price: Number.isFinite(price) ? price : 0,
        ...(option.deleted === true ? { deleted: true } : {}),
      }];
    }) : [];

    return [{
      ...(isProductEntityId(variation.id) ? { id: variation.id } : {}),
      name_en: typeof variation.name_en === 'string' ? variation.name_en : typeof name.en === 'string' ? name.en : '',
      name_ar: typeof variation.name_ar === 'string' ? variation.name_ar : typeof name.ar === 'string' ? name.ar : '',
      options,
      ...(variation.deleted === true ? { deleted: true } : {}),
    }];
  });
}

function getCreatedId(value: unknown): ProductEntityId | null {
  if (!isRecord(value)) return null;
  if (isProductEntityId(value.id)) return value.id;
  return isRecord(value.data) && isProductEntityId(value.data.id) ? value.data.id : null;
}

export default function EditProductPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const tForm = useTranslations('admin.form');
  const params = useParams();
  const id = params.id as string;

  const { data: categoriesRes, isLoading: isLoadingCategories } = useApiGet(categoriesAdmin.getCategoriesList, locale);
  const categoriesList: CategoryListItem[] = Array.isArray(categoriesRes) ? categoriesRes : [];
  const categoryOptions = categoriesList.map((c) => ({
    value: c.id,
    label: getLocalizedText(c.name, locale)
  }));

  const { data: product, isLoading: fetching } = useApiGet(productsAdmin.getProduct, id, locale);

  const { execute: updateProduct, isLoading: isUpdating } = useApiAction(productsAdmin.updateProduct, {
    showSuccessToast: true,
    successMsg: tForm('successEdit'),
  });
  const pData = product;

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
      name: 'discount',
      label: t('form.discount'),
      type: 'number',
      required: false,
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
      section: t('pages.products.tabs.pricing'),
      sectionOrder: 2,
      sidebar: false,
    },
    {
      name: 'image',
      label: t('form.image'),
      type: 'file',
      required: false,
      section: t('pages.products.tabs.media'),
      sectionOrder: 3,
      sidebar: false,
    },
    {
      name: 'status',
      label: t('table.active'),
      type: 'switch',
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
      fullWidth: true,
      render: ({ value, onChange, error, field }) => (
        <GalleryUploader
          value={value}
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
          value={value}
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
    if (data.discount) formData.append('discount', String(data.discount));
    if (data.discount_from) formData.append('discount_from', String(data.discount_from));
    if (data.discount_to) formData.append('discount_to', String(data.discount_to));
    formData.append('category_id', String(data.category_id ?? ''));
    formData.append('is_parent', Boolean(data.is_parent) ? '1' : '0');
    formData.append('status', Boolean(data.status) ? '1' : '0');

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const result = await updateProduct(id, formData);
    if (!result.success) return;

    const selectedGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const keptGalleryIds = new Set(
      selectedGallery
        .filter(isGalleryImage)
        .map((image) => String(image.id))
    );
    const galleryDeletes = (toGalleryImages(pData?.gallery) ?? [])
      .filter((image) => !keptGalleryIds.has(String(image.id)))
      .map((image) => productsAdmin.deleteGalleryImage(image.id));
    const newGalleryFiles = selectedGallery.filter((value): value is File => value instanceof File);

    await Promise.all(galleryDeletes);
    if (newGalleryFiles.length > 0) {
      const galleryFormData = new FormData();
      newGalleryFiles.forEach((file) => galleryFormData.append('images[]', file));
      await productsAdmin.addGallery(id, galleryFormData);
    }

    const variations = toProductVariations(data.variations);
    const deletedVariationIds = new Set(
      variations.flatMap((variation) =>
        variation.deleted && variation.id !== undefined ? [variation.id] : []
      )
    );
    await Promise.all(Array.from(deletedVariationIds, (variationId) => productsAdmin.deleteVariation(variationId)));

    for (const variation of variations.filter((item) => !item.deleted)) {
      const validOptions = variation.options.filter((option) => !option.deleted);

      if (variation.id === undefined) {
        if (!variation.name_en.trim() || !variation.name_ar.trim()) continue;
        const variationResponse = await productsAdmin.addVariation(id, {
          name: { en: variation.name_en, ar: variation.name_ar },
        });
        const variationId = getCreatedId(variationResponse.data);
        if (variationId === null) continue;

        for (const option of validOptions) {
          if (!option.name_en.trim() || !option.name_ar.trim()) continue;
          await productsAdmin.addOption(variationId, {
            name: { en: option.name_en, ar: option.name_ar },
            price: option.price,
          });
        }
        continue;
      }

      const deletedOptionIds = variation.options
        .filter((option) => option.deleted && option.id !== undefined)
        .map((option) => option.id as ProductEntityId);
      await Promise.all(deletedOptionIds.map((optionId) => productsAdmin.deleteOption(optionId)));

      for (const option of validOptions.filter((item) => item.id === undefined)) {
        if (!option.name_en.trim() || !option.name_ar.trim()) continue;
        await productsAdmin.addOption(variation.id, {
          name: { en: option.name_en, ar: option.name_ar },
          price: option.price,
        });
      }
    }

    router.back();
  };

  const initialData = pData ? {
    name_en: pData.name?.en ?? '',
    name_ar: pData.name?.ar ?? '',
    description_en: pData.description?.en ?? pData.description ?? '',
    description_ar: pData.description?.ar ?? pData.description ?? '',
    price: pData.price ?? 0,
    discount: pData.discount ?? 0,
    discount_from: pData.discount_from ?? '',
    discount_to: pData.discount_to ?? '',
    category_id: pData.category_id ?? pData.category?.id ?? '',
    is_parent: pData.is_parent === 1 || pData.is_parent === true,
    status: pData.status === 1 || pData.status === true,
    image: pData.image_url ?? (pData.image && !pData.image.startsWith('http')
      ? `https://ecommerce.mazoom.online/storage/${pData.image.replace(/\\/g, '/')}`
      : pData.image),
    gallery: toGalleryImages(pData.gallery) ?? [],
    variations: toProductVariations(pData.variations),
  } : undefined;

  if (fetching || isLoadingCategories) {
    return (
      <div className="p-6 space-y-6">
        <TableSkeleton rows={7} cols={3} />
      </div>
    );
  }

  return (
    <AddPage
      title={t('pages.products.editTitle')}
      fields={fields}
      onSave={handleSave}
      onCancel={() => router.back()}
      isSaving={fetching || isUpdating}
      initialData={initialData}
    />
  );
}
