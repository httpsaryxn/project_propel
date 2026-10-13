import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVisits } from '../../services/visitService';
import { formatDate, formatLPA } from '../../utils/formatters';
import { Building2, FileText, Award, Bell, CheckCircle2, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const profile = user?.student_profile;

  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    const fetchLiveVisits = async () => {
      try {
        setLoadingVisits(true);
        const res = await getVisits();
        if (res.success && res.data) {
          setVisits(res.data);
        }
      } catch (err) {
        console.error('Error fetching campus visits:', err);
      } finally {
        setLoadingVisits(false);
      }
    };

    fetchLiveVisits();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Student Portal Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Welcome back, {profile ? `${profile.first_name} ${profile.last_name}` : 'Student'}! 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Track company eligibility, manage your application pipeline, review active offers, and check placement notifications.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              <span className="text-slate-500">Roll No:</span> <strong className="text-white">{profile?.roll_no || 'N/A'}</strong>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              <span className="text-slate-500">Branch:</span> <strong className="text-white">{profile?.branch || 'N/A'}</strong>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              <span className="text-slate-500">Passout Year:</span> <strong className="text-white">{profile?.passout_year || '2026'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/student/companies"
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-blue-400 transition-colors">Eligible Drives</h3>
          <p className="text-xs text-slate-400">View matching company criteria and job packages</p>
        </Link>

        <Link
          to="/student/applications"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-emerald-400 transition-colors">Applications</h3>
          <p className="text-xs text-slate-400">Monitor round selection progress and statuses</p>
        </Link>

        <Link
          to="/student/offers"
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-amber-400 transition-colors">My Offers</h3>
          <p className="text-xs text-slate-400">Review placement offer letters & package details</p>
        </Link>

        <Link
          to="/student/notifications"
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1 group-hover:text-purple-400 transition-colors">Notifications</h3>
          <p className="text-xs text-slate-400">Drive schedules, venue updates, and announcements</p>
        </Link>
      </div>

      {/* SYNCED DATABASE: Scheduled Campus Company Drives */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Upcoming Campus Company Drives (Database Synced)</span>
          </h2>
          <Link to="/student/companies" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
            View All Drives ➔
          </Link>
        </div>

        {loadingVisits ? (
          <div className="p-6 text-center text-slate-400 text-xs">Syncing visits with PostgreSQL database...</div>
        ) : visits.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No campus visits scheduled at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.map((v) => (
              <div key={v.visit_id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{v.company_name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    {formatLPA(v.package_lpa)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{v.job_profile}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{formatDate(v.visit_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{v.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rule 5 Advisory Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <strong className="text-white text-sm block">Placement Policy Rule 5 Active</strong>
          <p className="text-slate-400 leading-relaxed">
            If you accept a placement offer, you will only be allowed to apply for future companies whose package LPA is within <strong>₹5 LPA</strong> of your accepted offer.
          </p>
        </div>
      </div>
    </div>
  );
}
