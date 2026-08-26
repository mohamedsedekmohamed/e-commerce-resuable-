'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { User, Mail, Phone, ShoppingBag, Camera, UserCheck, Trash2, Save } from 'lucide-react';
import Image from 'next/image';
import { useApiGet, useApiAction } from '@/hooks/useApi';
import { userProfile } from '@/services/userProfile';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';
import ConfirmDelete from '@/components/shared/ConfirmDelete';

export default function ProfilePage() {
  const locale = useLocale();
  const t = useTranslations('user_dashboard');
  const tCommon = useTranslations('common');
  const { data: userData, isLoading: isFetchingProfile, refetch } = useApiGet(userProfile.profile, locale);
  const { execute: updateProfile, isLoading: isUpdating } = useApiAction(userProfile.updateProfile, { showSuccessToast: true });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      setImagePreview(userData.image || null);
      
      const currentUser = authService.getUser('user');
      const token = authService.getToken('user');
      if (currentUser && token) {
        const updatedUser = { 
          ...currentUser, 
          name: userData.name, 
          email: userData.email, 
          phone: userData.phone, 
          image_url: userData.image 
        };
        // Avoid infinite loop if same
        if (JSON.stringify(currentUser) !== JSON.stringify(updatedUser)) {
          authService.saveSession(token, currentUser.role, updatedUser);
          window.dispatchEvent(new Event('user-updated'));
        }
      }
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setDeleteImage(false);
    }
  };

  const handleDeleteImage = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setDeleteImage(true);
    setShowDeleteModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(tCommon('fillRequired'));
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    data.append('delete_image', deleteImage ? '1' : '0');

    const res = await updateProfile(data, locale);
    if (res.success) {
      refetch();
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* ── Profile Header Banner ── */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-12 -end-12 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-start w-full">
          {/* Avatar Ring */}
          <div className="relative group shrink-0">
            <div className="p-1 bg-gradient-to-tr from-primary via-primary/50 to-primary/20 rounded-full shadow-md">
              <div className="w-24 h-24 rounded-full overflow-hidden relative bg-muted flex items-center justify-center border-2 border-background">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt={formData.name || 'User'} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground/60" />
                )}
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden" 
              accept="image/*"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-1 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </div>

            {imagePreview && (
              <button 
                type="button"
                onClick={handleDeleteImage}
                className="absolute -bottom-2 -end-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                title="Remove Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* User Details */}
          <div className="flex flex-col gap-1.5 flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {userData.name}
            </h1>
            <p className="text-muted-foreground font-medium">
              {userData.email}
            </p>
          </div>
        </div>

        {/* Orders Quick Metric Widget */}
        <div className="w-full md:w-auto bg-background/80 backdrop-blur-sm border border-border/60 rounded-2xl p-4 md:p-5 flex items-center gap-4 min-w-[220px] shadow-xs relative z-10 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('orders')}
            </span>
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {userData.order_count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Personal Information Card ── */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {t('personal_info')}
              </h2>
            </div>
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t('update_profile')}
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('full_name')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <User className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full rounded-xl border border-border/50 bg-muted/30 p-4 ps-11 text-sm font-semibold text-foreground placeholder:font-normal focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:bg-muted/50"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('email_address')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <Mail className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-full rounded-xl border border-border/50 bg-muted/30 p-4 ps-11 text-sm font-semibold text-foreground placeholder:font-normal focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:bg-muted/50"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('phone_number')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <Phone className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="block w-full rounded-xl border border-border/50 bg-muted/30 p-4 ps-11 text-sm font-semibold text-foreground placeholder:font-normal focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:bg-muted/50"
              />
            </div>
          </div>
          
        </div>
      </div>
    </form>

    {showDeleteModal && (
      <ConfirmDelete 
        title={locale === 'ar' ? 'حذف الصورة الشخصية' : 'Delete Profile Picture'}
        description={locale === 'ar' ? 'هل أنت متأكد من حذف الصورة الشخصية؟ سيتم إزالتها نهائياً.' : 'Are you sure you want to delete your profile picture? This action cannot be undone.'}
        onConfirm={confirmDeleteImage}
        onCancel={() => setShowDeleteModal(false)}
      />
    )}
    </>
  );
}
