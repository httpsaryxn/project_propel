import React, { useState, useEffect } from 'react';
import { getVisits, scheduleVisit } from '../../services/visitService';
import { getCompanies } from '../../services/companyService';
import { Calendar, Plus, MapPin, Building2, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    company_id: '',
    visit_date: '',
    venue: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([getVisits(), getCompanies()]);
      if (vRes.success) setVisits(vRes.data);
      if (cRes.success) setCompanies(cRes.data);
    } catch (err) {
      setError('Failed to load visit schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.company_id || !form.visit_date || !form.venue) {
      setError('Please select a company, visit date, and venue.');
      return;
    }

    try {
      const res = await scheduleVisit({
        ...form,
        company_id: Number(form.company_id)
      });
      if (res.success) {
        setSuccessMsg('Company visit scheduled! Notification triggered for all eligible students.');
        setForm({ company_id: '', visit_date: '', venue: '', description: '' });
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule visit.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-400 text-xs">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-400 text-xs">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>Campus Visit Scheduler</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Schedule company arrival dates and venues. Scheduling a visit automatically dispatches notifications to students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Schedule New Visit</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Company *</label>
              <select
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.company_name} ({c.job_profile})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Visit Date *</label>
              <input
                type="date"
                value={form.visit_date}
                onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Venue / Auditorium *</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="e.g. Main Auditorium Hall 2"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Visit Description / Agenda</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Pre-placement talk, online test & interview schedule..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Dispatch & Schedule Visit
            </button>
          </form>
        </div>

        {/* Scheduled Visits Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Scheduled Drive Timeline</span>
            <span className="text-xs font-medium text-slate-400">{visits.length} Drives</span>
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading schedules...</div>
          ) : visits.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
              No campus visits scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {visits.map((v) => (
                <div key={v.visit_id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center shrink-0 text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{v.company_name}</h3>
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {formatDate(v.visit_date)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{v.job_profile} • {v.location}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Venue: <strong>{v.venue}</strong></span>
                    </div>

                    {v.description && (
                      <p className="text-[11px] text-slate-500 pt-1 italic">{v.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
