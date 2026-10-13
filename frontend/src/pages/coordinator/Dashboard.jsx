import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Building2, Users, FileSpreadsheet, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Training & Placement Cell Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Placement Management System Overview
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Logged in as <strong className="text-white">{user?.email}</strong>. Manage recruiting companies, upload round results, schedule campus drives, and generate placement analytics.
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/coordinator/companies"
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-indigo-400 transition-colors">Manage Companies</h3>
          <p className="text-xs text-slate-400">Add hiring companies, criteria & allowed branches</p>
        </Link>

        <Link
          to="/coordinator/students"
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-blue-400 transition-colors">Student Registry</h3>
          <p className="text-xs text-slate-400">View registered students, SGPA/CGPA records</p>
        </Link>

        <Link
          to="/coordinator/applications"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-emerald-400 transition-colors">Applications</h3>
          <p className="text-xs text-slate-400">Review student applications & shortlist candidates</p>
        </Link>

        <Link
          to="/coordinator/visits"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-amber-400 transition-colors">Company Visits</h3>
          <p className="text-xs text-slate-400">Schedule drive dates & send auto notifications</p>
        </Link>
      </div>
    </div>
  );
}
