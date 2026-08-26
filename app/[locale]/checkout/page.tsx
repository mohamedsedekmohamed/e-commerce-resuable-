'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { userCart } from '@/services/userCart';
import { userOrder } from '@/services/userOrder';
import { userAddress } from '@/services/userAddress';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, CreditCard, Wallet, MapPin, Receipt, CheckCircle, Store, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { StoreCartItem, StoreCartResponse } from '@/types/store.interface';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface City {
  id: number;
  name: string;
}
import { AddressEntity } from '@/types/address.interface';

interface Zone {
  id: number;
  name: string;
  price: string;
}

export default function CheckoutPage() {
  const t = useTranslations('cart'); // Reusing cart translations for now
  const tForm = useTranslations('admin.form');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();

  const [cartItems, setCartItems] = useState<StoreCartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<AddressEntity[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | string | 'new'>('new');
  
  const [cities, setCities] = useState<City[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);
  const [errors, setErrors] = useState<{
    city?: string;
    zone?: string;
    receipt?: string;
  }>({});

  useEffect(() => {
    let isCurrent = true;
    const fetchData = async () => {
      try {
        const [cartRes, listsRes, addrRes] = await Promise.all([
          userCart.index(locale),
          userOrder.lists(locale),
          userAddress.index(locale).catch(() => ({ data: { data: [] } }))
        ]);
        
        const cartData = cartRes.data as StoreCartResponse;
        if (isCurrent) {
          setCartItems(cartData.cart ?? []);
          // Fetch payment methods from lists endpoint
          const listsData = listsRes.data as { payment_methods?: PaymentMethod[] };
          if (listsData?.payment_methods) {
             setPaymentMethods(listsData.payment_methods);
          }
          
          const addresses = addrRes?.data?.data || [];
          setSavedAddresses(addresses);
          if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
            setSelectedCity(String(addresses[0].city_id));
            setSelectedZone(String(addresses[0].zone_id));
          }
        }
      } catch (error) {
        console.error('Failed to load checkout data', error);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchData();
    return () => { isCurrent = false; };
  }, [locale]);

  // Fetch Cities on mount
  useEffect(() => {
    setIsCitiesLoading(true);
    userAddress.cities(locale)
      .then(res => setCities((res.data as City[]).filter(c => c.name))) // Filter out nulls
      .catch(err => console.error('Failed to load cities', err))
      .finally(() => setIsCitiesLoading(false));
  }, [locale]);

  // Fetch Zones when city changes
  useEffect(() => {
    if (!selectedCity) {
      setZones([]);
      setSelectedZone('');
      return;
    }
    setIsZonesLoading(true);
    userAddress.zones(locale, selectedCity)
      .then(res => setZones((res.data as Zone[]).filter(z => z.name))) // Filter out nulls
      .catch(err => console.error('Failed to load zones', err))
      .finally(() => setIsZonesLoading(false));
  }, [selectedCity, locale]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.final_price || item.product?.price || 0;
      return total + (Number(price) * Number(item.count));
    }, 0);
  };

  const getShippingCost = () => {
    if (!selectedZone || !zones.length) return 0;
    const zone = zones.find(z => String(z.id) === selectedZone);
    return zone && zone.price ? Number(zone.price) : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error(t('empty_cart') || 'Cart is empty');
      return;
    }

    const selectedMethod = paymentMethods[selectedPaymentIndex];
    const requiresReceipt = true;
    
    const newErrors: typeof errors = {};

    if (requiresReceipt && !receiptFile) {
      newErrors.receipt = isRtl ? 'يرجى إرفاق إيصال الدفع.' : 'Please upload a receipt for payment.';
    }

    if (selectedAddressId === 'new') {
      if (!selectedCity) newErrors.city = isRtl ? 'يرجى اختيار المدينة.' : 'Please select a city.';
      if (!selectedZone) newErrors.zone = isRtl ? 'يرجى اختيار المنطقة.' : 'Please select a zone.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    setIsSubmitting(true);
    try {
      let addressId: number;
      if (selectedAddressId === 'new') {
        const cityName = cities.find(c => String(c.id) === selectedCity)?.name || '';
        const zoneName = zones.find(z => String(z.id) === selectedZone)?.name || '';
        
        const addressData = {
          address: `${cityName}, ${zoneName}`,
          lat: '0',
          lng: '0',
          floor: 'N/A',
          street: 'N/A',
          building_number: 'N/A',
          city_id: Number(selectedCity),
          zone_id: Number(selectedZone),
          additional_data: ''
        };
        
        try {
          const addressRes = await userAddress.store(addressData);
          addressId = addressRes.data?.id;
          if (!addressId) throw new Error('Failed to get address ID');
        } catch (err) {
          console.error('Failed to create address:', err);
          toast.error('Failed to save shipping address. Please try again.');
          setIsSubmitting(false);
          return;
        }
      } else {
        addressId = Number(selectedAddressId);
      }

      // 2. Create Order
      const formData = new FormData();
      
      if (selectedMethod?.id) {
        formData.append('payment_method_id', String(selectedMethod.id));
      } else {
        // Fallback in case id is missing from API
        formData.append('payment_method_id', String(selectedPaymentIndex + 1));
      }

      // Use the newly created address ID
      formData.append('address_id', String(addressId)); 
      
      cartItems.forEach(item => {
        formData.append('cart_product_ids[]', String(item.cart_product_id));
      });

      if (couponCode) {
        formData.append('coupon_code', couponCode);
      }
      
      let paymentType = 'offline';
      if (selectedMethod?.id === 2) paymentType = 'stripe';

      formData.append('payment_type', paymentType);
      
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      const res = await userOrder.makeOrder(formData);
      toast.success(res.data?.message || 'Order placed successfully');
      
      // Clear cart locally
      await userCart.clear();
      useCartStore.getState().clearCart();
      
      // Redirect to orders page or order success page
      router.push(`/${locale}/account/orders`);
    } catch (err: unknown) {
      console.error('Failed to place order:', err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMsg || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container py-20 flex flex-col items-center justify-center gap-6">
          <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/20">
            <Store className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-foreground/70">{t('empty_cart')}</h2>
          <Link 
            href={`/${locale}/catalog`}
            className="px-8 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t('continue_shopping')}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 bg-white border border-border shadow-sm rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/50 transition-colors"
              title={isRtl ? 'الرجوع' : 'Back'}
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              {t('checkout') || 'Checkout'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Address Details (Mocked for now) */}
            <div className="bg-white border border-border/60 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-foreground/5 flex items-center gap-2 font-semibold">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </div>
              <div className="p-6 flex flex-col gap-4">
                
                {savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    {savedAddresses.map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setSelectedCity(String(addr.city_id));
                          setSelectedZone(String(addr.zone_id));
                        }}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedAddressId === addr.id 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {isRtl ? 'عنوان محفوظ' : 'Saved Address'}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary' : 'border-border'}`}>
                            {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed">{addr.address}</p>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        setSelectedAddressId('new');
                        setSelectedCity('');
                        setSelectedZone('');
                      }}
                      className={`p-4 border border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] ${
                        selectedAddressId === 'new'
                          ? 'border-primary bg-primary/5 shadow-sm text-primary' 
                          : 'border-border hover:border-primary/50 text-foreground/60'
                      }`}
                    >
                      <span className="font-semibold">{isRtl ? '+ إضافة عنوان جديد' : '+ Add New Address'}</span>
                    </div>
                  </div>
                )}

                {selectedAddressId === 'new' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground/80">City</label>
                      <select 
                        value={selectedCity}
                        onChange={e => { setSelectedCity(e.target.value); setSelectedZone(''); setErrors(prev => ({...prev, city: undefined})); }}
                        required
                        className={`p-3 bg-background border ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary/50'} rounded-md text-sm outline-none transition-colors cursor-pointer`}
                      >
                        <option value="">{isCitiesLoading ? 'Loading cities...' : 'Select a city'}</option>
                        {cities.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground/80">Zone</label>
                      <select 
                        value={selectedZone}
                        onChange={e => { setSelectedZone(e.target.value); setErrors(prev => ({...prev, zone: undefined})); }}
                        required
                        disabled={!selectedCity || isZonesLoading}
                        className={`p-3 bg-background border ${errors.zone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary/50'} rounded-md text-sm outline-none transition-colors cursor-pointer disabled:opacity-50`}
                      >
                        <option value="">{isZonesLoading ? 'Loading zones...' : 'Select a zone'}</option>
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>
                            {z.name} {z.price && z.price !== '0.00' ? `(+${z.price})` : ''}
                          </option>
                        ))}
                      </select>
                      {errors.zone && <span className="text-xs text-red-500">{errors.zone}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-border/60 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-foreground/5 flex items-center gap-2 font-semibold">
                <Wallet className="w-5 h-5 text-primary" />
                Payment Method
              </div>
              <div className="p-6 flex flex-col gap-4">
                {paymentMethods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedPaymentIndex(idx)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                          selectedPaymentIndex === idx 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="w-12 h-12 relative shrink-0 bg-white rounded-md border border-border/50 overflow-hidden flex items-center justify-center p-2">
                          {method.icon ? (
                            <Image src={method.icon} alt={method.name} fill className="object-contain p-2" />
                          ) : (
                            <CreditCard className="w-6 h-6 text-foreground/40" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-semibold text-foreground/90">{method.name}</span>
                          <span className="text-xs text-foreground/50 line-clamp-1">{method.description}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedPaymentIndex === idx ? 'border-primary' : 'border-border'
                        }`}>
                          {selectedPaymentIndex === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-foreground/5 rounded-md text-sm text-center text-foreground/60">
                    Loading payment methods...
                  </div>
                )}

                {/* Receipt Upload */}
                {paymentMethods[selectedPaymentIndex] && (
                  <div className={`mt-4 p-4 border ${errors.receipt ? 'border-red-500 bg-red-50/50' : 'border-border bg-background'} rounded-lg`}>
                    <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2 mb-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      {isRtl ? 'إرفاق إيصال الدفع' : 'Upload Payment Receipt'}
                    </label>
                    <p className="text-xs text-foreground/60 mb-4">
                      {isRtl 
                        ? 'يرجى إرفاق صورة أو لقطة شاشة لإيصال الدفع الخاص بك.' 
                        : 'Please upload a screenshot or image of your payment receipt.'}
                    </p>
                    
                    {!receiptFile ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-32 border-2 border-dashed ${errors.receipt ? 'border-red-400 hover:border-red-500' : 'border-border hover:border-primary/50'} rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-foreground/5`}
                      >
                        <Upload className="w-6 h-6 text-foreground/40" />
                        <span className="text-sm font-medium text-foreground/60">Click to upload image</span>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setReceiptFile(e.target.files[0]);
                              setErrors(prev => ({...prev, receipt: undefined}));
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full relative h-40 border border-border rounded-lg overflow-hidden bg-foreground/5">
                        <img 
                          src={URL.createObjectURL(receiptFile)} 
                          alt="Receipt Preview" 
                          className="w-full h-full object-contain"
                        />
                        <button 
                          type="button"
                          onClick={() => setReceiptFile(null)}
                          className="absolute top-2 end-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {errors.receipt && <p className="text-xs text-red-500 mt-2 font-medium">{errors.receipt}</p>}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Summary */}
          <div className="flex flex-col gap-6">
            <div className="border border-border/60 rounded-xl bg-white shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 border-b border-border bg-foreground/5 font-semibold text-lg">
                {t('order_summary') || 'Order Summary'}
              </div>
              
              <div className="p-6 flex flex-col gap-5">
                {/* Items preview */}
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.cart_product_id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-12 h-12 bg-foreground/5 rounded shrink-0 overflow-hidden border border-border/50">
                          {item.product?.image && (
                            <Image src={item.product.image} alt={item.product?.name || ''} fill className="object-contain p-1" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium text-foreground/90 truncate">{item.product?.name}</span>
                          <span className="text-xs text-foreground/50">Qty: {item.count}</span>
                        </div>
                      </div>
                      <span className="font-semibold shrink-0">
                        {item.product?.final_price || item.product?.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70">{t('items_count', { count: cartItems.length })}</span>
                    <span className="font-semibold">{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70">{t('shipping_cost') || 'Shipping Cost'}</span>
                    <span className="font-semibold">
                      {getShippingCost() === 0 ? (t('free') || 'Free') : getShippingCost().toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Coupon */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-xs font-semibold text-foreground/70">Coupon Code (Optional)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 p-2 bg-background border border-border rounded text-sm outline-none focus:border-primary/50"
                        placeholder="Enter code"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                    <span className="font-bold text-base">{t('total')}</span>
                    <span className="font-bold text-2xl text-primary">{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full py-4 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-secondary-400 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('place_order') || 'Place Order'}
                      {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
      <Footer />
    </main>
  );
}
