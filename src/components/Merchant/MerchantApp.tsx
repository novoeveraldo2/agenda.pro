import React, { useState } from 'react';
import { Sidebar } from '../Layout/Sidebar';
import { Header } from '../Layout/Header';
import { Dashboard } from '../Dashboard/Dashboard';
import { AppointmentForm } from '../Appointments/AppointmentForm';
import { AppointmentsList } from '../Appointments/AppointmentsList';
import { FinanceManager } from '../Finances/FinanceManager';
import { ServicesManager } from '../Services/ServicesManager';
import { ProfileSettings } from '../Profile/ProfileSettings';
import { PlanStatus } from './PlanStatus';
import { ClientsList } from './ClientsList';

export const MerchantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'appointments':
        return <AppointmentsList />;
      case 'new-appointment':
        return <AppointmentForm />;
      case 'services':
        return <ServicesManager />;
      case 'clients':
        return <ClientsList />;
      case 'finances':
        return <FinanceManager />;
      case 'profile':
        return <ProfileSettings />;
      case 'plan':
        return <PlanStatus />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};