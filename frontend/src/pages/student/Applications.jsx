import React, { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/applicationService';
import { formatLPA, formatDate } from '../../utils/formatters';
import { FileText, Building2, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getMyApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      setError('Failed to fetch submitted applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-xs">🎉 Selected</span>;
      case 'Shortlisted':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-semibold text-xs">⭐ Shortlisted</span>;
      case 'Interviewing':
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full font-semibold text-xs">🎙️ Interviewing</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-semibold text-xs">❌ Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full font-medium text-xs">⏳ Applied</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span>My Job Applications</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track round evaluation results and recruitment status for all companies you have applied for.
        </p>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-xs">
          You haven't submitted any company applications yet. Check out "Eligible Companies" to apply!
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Job Profile</th>
                  <th className="p-4">Package (LPA)</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-bold text-white text-sm">{app.company_name}</td>
                    <td className="p-4 text-slate-300">{app.job_profile}</td>
                    <td className="p-4">
                      <span className="font-semibold text-emerald-400">{formatLPA(app.package_lpa)}</span>
                    </td>
                    <td className="p-4 text-slate-400">{formatDate(app.applied_on)}</td>
                    <td className="p-4 text-right">{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
