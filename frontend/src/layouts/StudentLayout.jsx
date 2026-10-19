import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, User, Building2, FileText, Award, Bell, LogOut } from 'lucide-react';
import AcademicCriteriaModal from '../components/student/AcademicCriteriaModal';

export default function StudentLayout() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: Rocket },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'Visiting Companies', path: '/student/companies', icon: Building2 },
    { label: 'My Applications', path: '/student/applications', icon: FileText },
    { label: 'My Offers', path: '/student/offers', icon: Award },
    { label: 'Notifications', path: '/student/notifications', icon: Bell }
  ];

  // Check if student has not recorded their academic criteria yet
  const needsAcademicSetup =
    user?.role === 'student' &&
    user?.student_profile &&
    !user.student_profile.academic_recorded;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/student/dashboard" className="flex items-center gap-3 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Rocket className="w-4 h-4" />
            </div>
            <span>Propel <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Student</span></span>
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
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
              <div className="text-xs font-medium text-slate-200">
                {user?.student_profile ? `${user.student_profile.first_name} ${user.student_profile.last_name}` : user?.email}
              </div>
              <div className="text-[10px] text-slate-500">
                {user?.student_profile?.branch || 'Student Account'}
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

      {/* Mandatory First-Time Academic Criteria Modal */}
      <AcademicCriteriaModal
        isOpen={Boolean(needsAcademicSetup)}
        onComplete={() => refreshUser()}
      />
    </div>
  );
}
