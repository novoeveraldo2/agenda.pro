import { useState, useEffect } from 'react';
import { Service } from '../types';
import { useAuth } from '../contexts/AuthContext';

const defaultServices: Omit<Service, 'tenantId' | 'createdAt'>[] = [
  {
    id: '1',
    name: 'Corte de Cabelo',
    duration: 30,
    price: 25.00,
    description: 'Corte masculino tradicional',
    isActive: true
  },
  {
    id: '2',
    name: 'Barba',
    duration: 20,
    price: 15.00,
    description: 'Aparar e modelar barba',
    isActive: true
  },
  {
    id: '3',
    name: 'Corte + Barba',
    duration: 45,
    price: 35.00,
    description: 'Combo completo',
    isActive: true
  },
  {
    id: '4',
    name: 'Sobrancelha',
    duration: 15,
    price: 10.00,
    description: 'Design de sobrancelha',
    isActive: true
  }
];

export const useServices = () => {
  const { tenant } = useAuth();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (tenant) {
      const stored = localStorage.getItem(`services_${tenant.id}`);
      if (stored) {
        try {
          const parsedServices = JSON.parse(stored);
          setServices(parsedServices);
        } catch (error) {
          console.error('Error parsing services from localStorage:', error);
          // Initialize with default services if parsing fails
          initializeDefaultServices();
        }
      } else {
        // Initialize with default services for new tenants
        initializeDefaultServices();
      }
    }
  }, [tenant]);

  const initializeDefaultServices = () => {
    if (!tenant) return;
    
    const initialServices: Service[] = defaultServices.map(service => ({
      ...service,
      tenantId: tenant.id,
      createdAt: new Date().toISOString()
    }));
    
    setServices(initialServices);
    localStorage.setItem(`services_${tenant.id}`, JSON.stringify(initialServices));
  };

  const saveServices = (newServices: Service[]) => {
    if (tenant) {
      try {
        setServices(newServices);
        localStorage.setItem(`services_${tenant.id}`, JSON.stringify(newServices));
      } catch (error) {
        console.error('Error saving services to localStorage:', error);
      }
    }
  };

  const addService = (service: Omit<Service, 'id' | 'tenantId' | 'createdAt'>) => {
    if (!tenant) return null;

    const newService: Service = {
      ...service,
      id: `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString()
    };

    const updated = [...services, newService];
    saveServices(updated);
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    const updated = services.map(service =>
      service.id === id ? { ...service, ...updates } : service
    );
    saveServices(updated);
  };

  const deleteService = (id: string) => {
    const updated = services.filter(service => service.id !== id);
    saveServices(updated);
  };

  const getActiveServices = () => {
    return services.filter(service => service.isActive);
  };

  return {
    services,
    addService,
    updateService,
    deleteService,
    getActiveServices
  };
};