import React from 'react';
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  FileText,
  Ambulance,
  Car,
  MapPin,
  History,
  BarChart3,
  Terminal,
  Settings,
  Info,
  Shield,
  Radio,
  LogOut,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useApp, PageId } from '../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentPage,
    setCurrentPage,
    user,
    logout,
    kpis,
    isBackendConnected,
  } = useApp();

  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Video, badge: '12', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'detection', label: 'Accident Detection', icon: AlertTriangle, badge: 'AI', badgeColor: 'bg-rose-500/20 text-rose-400' },
    { id: 'incident-details', label: 'Incident Details', icon: FileText },
    { id: 'emergency-response', label: 'Emergency Response', icon: Ambulance, badge: 'LIVE', badgeColor: 'bg-amber-500/20 text-amber-400 animate-pulse' },
    { id: 'anpr', label: 'Vehicle / ANPR', icon: Car },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'history', label: 'Incident History', icon: History, badge: kpis.totalIncidentsToday },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-logs', label: 'AI Detection Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About JeevanSetu', icon: Info },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 text-white font-black text-lg">
              JS
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  JeevanSetu
                </h1>
                <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-[130px]">
                Detect. Respond. Save Seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Live Network Pill */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">System Online</span>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isBackendConnected
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
            }`}
          >
            {isBackendConnected ? 'Backend Connected' : 'Demo Fallback'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Operator & Sign Out Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 text-xs font-bold border border-slate-700">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Commander'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@jeevansetu.ai'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
