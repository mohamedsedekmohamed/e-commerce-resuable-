'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { userHome } from '@/services/userHome';
import { useApiGet } from '@/hooks/useApi';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  CircleDollarSign,
  FileText,
  Image as ImageIcon,
  Images,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { userCart } from '@/services/userCart';
import { useCartStore } from '@/store/useCartStore';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';
import {
  StoreGalleryImage,
  StoreProductDetails,
} from '@/types/store.interface';

function ImgFallback({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-foreground/15">
      <ImageIcon className="w-8 h-8" />
    </div>
  );
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => setErr(true)}
    />
  );
}

function normalizeImageUrl(src?: string | null) {
  if (!src) return null;

  // Accommodate a value copied from a Markdown response such as [url](url).
  const markdownUrl = src.match(/^\[[^\]]*\]\((https?:\/\/[^\s)]+)\)$/);
  return markdownUrl?.[1] ?? src;
}

export default function ProductDetails({ productId }: { productId: string }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const { data, isLoading } = useApiGet(userHome.productDetails, locale, productId);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isOrdering, setIsOrdering] = useState(false);

  if (isLoading) return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-foreground/5" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 bg-foreground/5" />
          <div className="h-7 w-2/3 bg-foreground/8" />
          <div className="h-9 w-28 bg-foreground/6 mt-3" />
          <div className="h-20 w-full bg-foreground/4 mt-2" />
        </div>
      </div>
    </div>
  );

  if (!data) return null;

  interface ApiProductEnvelope {
    data?: StoreProductDetails;
  }

  const rawData = data as ApiProductEnvelope | StoreProductDetails;
  const productData: StoreProductDetails | null = 'data' in rawData && rawData.data
    ? rawData.data
    : (rawData as StoreProductDetails);

  const product = productData?.product;
  const gallery = productData?.gallery ?? [];
  if (!product) return null;

  const fullGallery = [
    product.image ? { id: 0, image: product.image } : null,
    ...gallery,
  ]
    .filter((image): image is StoreGalleryImage => image !== null)
    .flatMap((image) => {
      const imageUrl = normalizeImageUrl(image.image);
      return imageUrl ? [{ ...image, image: imageUrl }] : [];
    });
  const currentImage = normalizeImageUrl(activeImage) ?? fullGallery[0]?.image;
  const hasDiscount = Number(product.discount) > 0;
  const categoryName = typeof product.category === 'string'
    ? product.category
    : product.category?.name;
  const variations = product.variations ?? [];
  const displayedPrice = product.final_price ?? product.price;
  const originalPrice = Number(product.price);
  const finalPrice = Number(displayedPrice);
  const savings = hasDiscount && Number.isFinite(originalPrice) && Number.isFinite(finalPrice)
    ? Math.max(originalPrice - finalPrice, 0)
    : null;
  const selectedOptionDetails = variations.flatMap((variation) => {
    const option = variation.options.find(
      (item) => String(item.id) === selectedOptions[String(variation.id)]
    );

    return option ? [{ variationName: variation.name, optionName: option.name }] : [];
  });

  const handleOrderNow = async () => {
    if (!authService.getToken('user')) {
      toast.error(isRtl ? 'يجب تسجيل الدخول أولاً لإضافة منتجات للسلة' : 'You must log in to add items to cart');
      router.push(`/${locale}/auth/login`);
      return;
    }

    // Validate options
    if (variations.length > 0) {
      const missing = variations.some(v => !selectedOptions[String(v.id)]);
      if (missing) {
        toast.error(t('select_options_first') || 'Please select all options');
        return;
      }
    }

    setIsOrdering(true);
    try {
      // Add to cart
      const optionsArray = Object.values(selectedOptions).map(Number);
      await userCart.store({
        product_id: product.id,
        count: 1,
        options: optionsArray,
        local: locale
      });
      // Update cart state globally
      useCartStore.getState().fetchCart(locale);
      toast.success(t('added_to_cart') || 'Added to cart successfully');
    } catch (err: unknown) {
      console.error('Failed to order now', err);
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMessage || 'Failed to process request');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="bg-background" dir={t('ltr')}>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-border bg-card">
        <div className="container">
          <div className="flex items-center gap-1.5 py-3 text-[10px] text-foreground/35 font-medium">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors duration-150">
              {t('home')}
            </Link>
            {isRtl ? <ChevronLeft className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
            <Link href={`/${locale}/catalog`} className="hover:text-primary transition-colors duration-150">
              {t('products')}
            </Link>
            {isRtl ? <ChevronLeft className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
            <span className="text-foreground/55 line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* ── Gallery ── */}
          <div className="flex flex-col gap-2.5 lg:sticky lg:top-20">
            <div className="flex items-center justify-between text-xs font-medium text-foreground/55">
              <span className="inline-flex items-center gap-2">
                <Images className="w-4 h-4 text-primary" />
                {t('product_images')}
              </span>
              {fullGallery.length > 0 && <span>{fullGallery.length}</span>}
            </div>

            {/* Main image */}
            <div className="relative w-full aspect-square bg-card border border-border overflow-hidden rounded-xl">
              {hasDiscount && (
                <span className={`absolute top-3 z-20 ph-badge-discount ${t('left_3')}`}>
                  -{product.discount}%
                </span>
              )}
              {currentImage ? (
                <ImgFallback
                  src={currentImage}
                  alt={product.name}
                  className="object-contain p-6"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-bold text-foreground/4">
                    {(product.name || 'P').charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails — tight strip ── */}
            {fullGallery.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 ph-hide-scrollbar">
                {fullGallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img.image)}
                    aria-label={t('show_image', { number: i + 1 })}
                    aria-current={currentImage === img.image ? 'true' : undefined}
                    className={`relative shrink-0 w-14 h-14 overflow-hidden rounded-md border transition-colors duration-150 ${
                      currentImage === img.image
                        ? 'border-secondary'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <ImgFallback
                      src={img.image}
                      alt={`${product.name} ${i + 1}`}
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col gap-6">

            {/* Category + Name ── */}
            <div className="flex flex-col gap-2 pb-5 border-b border-border">
              {categoryName && (
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-foreground/35">
                  {categoryName}
                </span>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight">
                {product.name}
              </h1>
              {product.brand && (
                <span className="text-xs text-foreground/40 font-medium">
                  {t('brand')}{product.brand}
                </span>
              )}
            </div>

            {/* Price and product facts */}
            <section className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground/55">{isRtl ? 'السعر' : 'Price'}</p>
                    <p className="mt-0.5 text-2xl font-extrabold leading-none text-foreground">{displayedPrice ?? '—'}</p>
                  </div>
                </div>
                {hasDiscount && <span className="ph-badge-discount">-{product.discount}%</span>}
              </div>

              {hasDiscount && (
                <div className="grid grid-cols-1 gap-3 border-t border-border px-4 py-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-foreground/55">{t('price_before_discount')}</span>
                    <span className="font-semibold text-foreground/45 line-through">{product.price}</span>
                  </div>
                  {savings !== null && (
                    <div className="flex items-center justify-between gap-3 text-primary">
                      <span>{t('you_save')}</span>
                      <span className="font-bold">{savings}</span>
                    </div>
                  )}
                </div>
              )}

              {(categoryName || product.brand) && (
                <dl className={`grid ${categoryName && product.brand ? 'grid-cols-2' : 'grid-cols-1'} border-t border-border text-sm`}>
                  {categoryName && (
                    <div className={`p-3.5 ${product.brand ? 'border-e border-border' : ''}`}>
                      <dt className="flex items-center gap-1.5 text-xs text-foreground/50"><Tag className="w-3.5 h-3.5" />{t('category')}</dt>
                      <dd className="mt-1 font-semibold text-foreground">{categoryName}</dd>
                    </div>
                  )}
                  {product.brand && (
                    <div className="p-3.5">
                      <dt className="flex items-center gap-1.5 text-xs text-foreground/50"><Tag className="w-3.5 h-3.5" />{t('brand')}</dt>
                      <dd className="mt-1 font-semibold text-foreground">{product.brand}</dd>
                    </div>
                  )}
                </dl>
              )}
            </section>

            {/* Description ── */}
            {product.description && product.description.trim().length > 1 && (
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-foreground/35">
                  {t('description')}
                </span>
                <p className="text-sm text-foreground/55 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variations ── */}
            {variations.length > 0 && (
              <div className="flex flex-col gap-5 pt-4 border-t border-border">
                {variations.map(variation => {
                  const selectedOption = variation.options.find(
                    (option) => String(option.id) === selectedOptions[String(variation.id)]
                  );

                  return (
                    <div key={variation.id} className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-foreground/55">
                          {variation.name}
                        </span>
                        <span className={`text-xs font-medium ${selectedOption ? 'text-primary' : 'text-foreground/40'}`}>
                          {selectedOption?.name ?? t('selection_required')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variation.options.map(option => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedOptions(prev => ({
                              ...prev,
                              [String(variation.id)]: String(option.id),
                            }))}
                            aria-pressed={selectedOptions[String(variation.id)] === String(option.id)}
                            className={`min-h-10 px-3 py-2 text-xs font-medium border rounded-md transition-colors duration-150 ${
                              selectedOptions[String(variation.id)] === String(option.id)
                                ? 'border-secondary bg-secondary text-white'
                                : 'border-border text-foreground/55 hover:border-foreground/40 hover:text-foreground'
                            }`}
                          >
                            {option.name}
                            {Number(option.price) > 0 && (
                              <span className="block text-[9px] opacity-55 font-normal mt-0.5">+{option.price}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {variations.length > 0 && (
              <section className="rounded-xl border border-border bg-muted/20 p-4" aria-live="polite">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`mt-0.5 w-5 h-5 shrink-0 ${selectedOptionDetails.length === variations.length ? 'text-primary' : 'text-foreground/30'}`} />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-foreground">{t('selected_options')}</h2>
                    {selectedOptionDetails.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedOptionDetails.map(({ variationName, optionName }) => (
                          <span key={variationName} className="rounded-full bg-card border border-border px-2.5 py-1 text-xs text-foreground/70">
                            {variationName}: <strong className="text-foreground">{optionName}</strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-foreground/50">{t('select_options_first')}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Add-to-cart CTA */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 mb-3">
              <button
                onClick={handleOrderNow}
                disabled={isOrdering}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isOrdering ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><ShoppingCart className="w-4 h-4" />{t('add_to_cart')}</>
                )}
              </button>
            </div>

            {/* PDF CTA ── */}
            {product.pdf && product.pdf.trim() !== '' && (
              <a
                href={product.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-secondary text-white font-semibold text-sm hover:bg-secondary-400 transition-colors duration-150 self-start"
              >
                <FileText className="w-4 h-4 shrink-0" />
                {t('download_product_pdf')}
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
