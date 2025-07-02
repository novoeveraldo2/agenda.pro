import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/Landing/LandingPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { MerchantApp } from './components/Merchant/MerchantApp';
import { BookingPage } from './components/Booking/BookingPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public booking route */}
      <Route path="/booking/:slug" element={<BookingPage />} />
      
      {/* Landing page */}
      <Route 
        path="/" 
        element={
          !isAuthenticated ? (
            <LandingPage />
          ) : user?.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/merchant" replace />
          )
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/admin/*" 
        element={
          !isAuthenticated ? (
            <Navigate to="/" replace />
          ) : user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/merchant" replace />
          )
        } 
      />
      
      <Route 
        path="/merchant/*" 
        element={
          !isAuthenticated ? (
            <Navigate to="/" replace />
          ) : user?.role === 'merchant' ? (
            <MerchantApp />
          ) : (
            <Navigate to="/admin" replace />
          )
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;