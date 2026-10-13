import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 text-center">
      <div className="max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col items-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">403 — Access Denied</h1>
        <p className="text-slate-400 text-xs mb-6">
          You do not have permission to access this portal or resource. Please check your user role or sign in with an authorized account.
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
