import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AlertModal } from './components/AlertModal';
import { NotificationModal } from './components/NotificationModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AccidentDetectionPage } from './pages/AccidentDetectionPage';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { EmergencyResponsePage } from './pages/EmergencyResponsePage';
import { VehicleAnprPage } from './pages/VehicleAnprPage';
import { MapPage } from './pages/MapPage';
import { IncidentHistoryPage } from './pages/IncidentHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiLogsPage } from './pages/AiLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

const MainLayout: React.FC = () => {
  const { user, currentPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If user is not logged in or on login page, show Login screen
  if (!user || currentPage === 'login') {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'monitoring':
        return <LiveMonitoringPage />;
      case 'detection':
        return <AccidentDetectionPage />;
      case 'incident-details':
        return <IncidentDetailsPage />;
      case 'emergency-response':
        return <EmergencyResponsePage />;
      case 'anpr':
        return <VehicleAnprPage />;
      case 'map':
        return <MapPage />;
      case 'history':
        return <IncidentHistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'ai-logs':
        return <AiLogsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar setMobileOpen={setMobileOpen} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Real-Time Modals */}
      <AlertModal />
      <NotificationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
