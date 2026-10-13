import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Rocket, ShieldCheck, BarChart3, GraduationCap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans">
      {/* Left Branding Hero Banner */}
      <div className="lg:w-5/12 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-white mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span>Project Propel</span>
          </Link>

          <div className="mt-8 space-y-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Placement Analytics & Recruitment System
            </h1>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
              Automated student eligibility calculation, company application management, multi-round placement results, and real-time analytical dashboards.
            </p>
          </div>
        </div>

        {/* Highlight Feature Badges */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <GraduationCap className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-xs text-slate-300">Automated 3NF Database Eligibility Engine</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300">Strict Package Offer Upgrade Constraints (Rule 5)</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-xs text-slate-300">Real-Time Placement & Package LPA Analytics</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          © 2026 Project Propel • Placement Management System
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
