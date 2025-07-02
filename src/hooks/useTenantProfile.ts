import { useState, useEffect } from 'react';
import { TenantProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useTenantProfile = () => {
  const { tenant } = useAuth();
  const [profile, setProfile] = useState<TenantProfile | null>(null);

  useEffect(() => {
    if (tenant) {
      const stored = localStorage.getItem(`profile_${tenant.id}`);
      if (stored) {
        try {
          const parsedProfile = JSON.parse(stored);
          setProfile(parsedProfile);
        } catch (error) {
          console.error('Error parsing profile from localStorage:', error);
          initializeDefaultProfile();
        }
      } else {
        initializeDefaultProfile();
      }
    }
  }, [tenant]);

  const initializeDefaultProfile = () => {
    if (!tenant) return;

    const defaultProfile: TenantProfile = {
      businessName: tenant.businessName || tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      workingHours: {
        start: '08:00',
        end: '18:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      paymentMethods: {
        pix: true,
        card: true,
        cash: true
      }
    };

    setProfile(defaultProfile);
    localStorage.setItem(`profile_${tenant.id}`, JSON.stringify(defaultProfile));
  };

  const updateProfile = (updates: Partial<TenantProfile>) => {
    if (!tenant || !profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem(`profile_${tenant.id}`, JSON.stringify(updatedProfile));
  };

  return {
    profile,
    updateProfile
  };
};