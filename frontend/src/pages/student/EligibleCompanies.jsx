import React, { useState, useEffect } from 'react';
import { getEligibleCompanies, applyCompany } from '../../services/applicationService';
import { formatLPA } from '../../utils/formatters';
import { Building2, CheckCircle2, AlertCircle, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function EligibleCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEligible = async () => {
    try {
      setLoading(true);
      const res = await getEligibleCompanies();
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch eligible companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligible();
  }, []);

  const handleApply = async (companyId, companyName) => {
    try {
      setError('');
      setSuccessMsg('');
      setApplyingId(companyId);
      const res = await applyCompany(companyId);
      if (res.success) {
        setSuccessMsg(`Applied for "${companyName}" successfully!`);
        fetchEligible();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Automatic Eligibility Engine Verified</span>
        </div>
        <h1 className="text-xl font-bold text-white">Eligible Campus Hiring Drives</h1>
        <p className="text-xs text-slate-400 mt-1">
          These companies match your academic branch, semester CGPA, backlog criteria, and passout batch.
        </p>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-xs">
          No eligible companies available at this moment. Keep your semester CGPA updated!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => {
            const hasApplied = Boolean(company.application_id);
            return (
              <div
                key={company.company_id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-lg font-bold text-white">{company.company_name}</h2>
                      <p className="text-xs font-medium text-blue-400">
                        {company.job_profile} ({company.job_type})
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
                      {formatLPA(company.package_lpa)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    {company.job_description || 'Full time campus hiring drive'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>Min CGPA: <strong className="text-white">{company.minimum_cgpa ?? '6.00'}</strong></div>
                    <div>Max Backlogs: <strong className="text-white">{company.maximum_backlogs ?? '0'}</strong></div>
                    <div>Gender: <strong className="text-white">{company.gender_requirement || 'Any'}</strong></div>
                    <div>Location: <strong className="text-white">{company.location || 'Pan India'}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Drive Status: <strong className="text-slate-300">{company.drive_status}</strong>
                  </div>

                  {hasApplied ? (
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Already Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(company.company_id, company.company_name)}
                      disabled={applyingId === company.company_id}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20"
                    >
                      {applyingId === company.company_id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
