import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Building2, Users, FileSpreadsheet, Calendar, BarChart3, Bell, LogOut } from 'lucide-react';

export default function CoordinatorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/coordinator/dashboard', icon: BarChart3 },
    { label: 'Companies', path: '/coordinator/companies', icon: Building2 },
    { label: 'Students', path: '/coordinator/students', icon: Users },
    { label: 'Applications', path: '/coordinator/applications', icon: FileSpreadsheet },
    { label: 'Visits', path: '/coordinator/visits', icon: Calendar },
    { label: 'Notifications', path: '/coordinator/notifications', icon: Bell }
  ];

  const isCoordinator = user?.role === 'coordinator' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Role Alert if current user is not coordinator */}
      {!isCoordinator && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-200 text-xs px-4 py-2 flex items-center justify-between">
          <span>⚠️ You are currently signed in as a Student ({user?.email}). Company creation requires a Coordinator account.</span>
          <button onClick={handleLogout} className="underline font-bold text-white hover:text-amber-100">
            Log Out & Switch
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/coordinator/dashboard" className="flex items-center gap-3 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Propel <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">T&P Coordinator</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-slate-200">{user?.email}</div>
              <div className={`text-[10px] font-semibold uppercase tracking-wide ${isCoordinator ? 'text-indigo-400' : 'text-amber-400'}`}>
                {isCoordinator ? 'Placement Coordinator' : 'Student Account'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
