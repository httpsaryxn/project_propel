import React, { useState, useEffect } from 'react';
import { getEligibleCompanies } from '../../services/applicationService';
import { formatLPA, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Check,
  GraduationCap,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Tag,
  Lock
} from 'lucide-react';
import JobApplicationModal from '../../components/student/JobApplicationModal';
import AcademicCriteriaModal from '../../components/student/AcademicCriteriaModal';

export default function EligibleCompanies() {
  const { user, refreshUser } = useAuth();
  const profile = user?.student_profile;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'eligible', 'ineligible', 'applied'
  const [expandedReasons, setExpandedReasons] = useState({});

  // Application Modal state
  const [selectedCompanyForApply, setSelectedCompanyForApply] = useState(null);

  // Edit Academic Criteria Modal state
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await getEligibleCompanies();
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campus drives and eligibility.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const toggleReasonExpand = (companyId) => {
    setExpandedReasons((prev) => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const handleApplySuccess = (companyName) => {
    setSuccessMsg(`Your application for ${companyName} has been submitted successfully with your skills & resume!`);
    fetchDrives();
    refreshUser();
  };

  // Filtered companies based on tab
  const eligibleCount = companies.filter((c) => c.is_eligible).length;
  const ineligibleCount = companies.filter((c) => !c.is_eligible).length;
  const appliedCount = companies.filter((c) => c.has_applied).length;

  const filteredCompanies = companies.filter((c) => {
    if (filterTab === 'eligible') return c.is_eligible;
    if (filterTab === 'ineligible') return !c.is_eligible;
    if (filterTab === 'applied') return c.has_applied;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-emerald-400 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-400 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Header Banner & Academic Criteria Summary */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real-Time Placement Eligibility Matcher</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Visiting Campus Hiring Drives</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Compare your academic scores against requirements set by visiting companies. If eligible, apply with your skills and resume. If ineligible, review the detailed breakdown.
            </p>
          </div>

          <button
            onClick={() => setIsCriteriaModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-blue-500/50 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Update Academic Criteria</span>
          </button>
        </div>

        {/* Student's Active Academic Metrics Strip */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Your CGPA</span>
            <span className="text-sm font-bold text-white">{profile?.cgpa || '0.00'}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">10th Score</span>
            <span className="text-sm font-bold text-white">{profile?.tenth_percentage ? `${profile.tenth_percentage}%` : 'N/A'}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">12th Score</span>
            <span className="text-sm font-bold text-white">{profile?.twelfth_percentage ? `${profile.twelfth_percentage}%` : 'N/A'}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Active Backlogs</span>
            <span className={`text-sm font-bold ${Number(profile?.active_backlogs) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {profile?.active_backlogs ?? 0}
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Branch</span>
            <span className="text-sm font-bold text-white truncate block">{profile?.branch || 'N/A'}</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Passing Batch</span>
            <span className="text-sm font-bold text-white">{profile?.passout_year || '2026'}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filterTab === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Visiting Drives ({companies.length})
        </button>
        <button
          onClick={() => setFilterTab('eligible')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filterTab === 'eligible'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Eligible</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
            {eligibleCount}
          </span>
        </button>
        <button
          onClick={() => setFilterTab('ineligible')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filterTab === 'ineligible'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Not Eligible</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300">
            {ineligibleCount}
          </span>
        </button>
        <button
          onClick={() => setFilterTab('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            filterTab === 'applied'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>Applied</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300">
            {appliedCount}
          </span>
        </button>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Evaluating your drive criteria with PostgreSQL rules...</span>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-xs">
          No campus hiring drives found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => {
            const isEligible = company.is_eligible;
            const hasApplied = company.has_applied;
            const isExpanded = Boolean(expandedReasons[company.company_id]);

            return (
              <div
                key={company.company_id}
                className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all duration-200 ${
                  hasApplied
                    ? 'border-purple-500/40 bg-slate-900/90'
                    : isEligible
                    ? 'border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-500/5'
                    : 'border-slate-800 hover:border-slate-700 opacity-95'
                }`}
              >
                <div>
                  {/* Company Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">{company.company_name}</h2>
                        {company.drive_status && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                            {company.drive_status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-blue-400 mt-0.5">
                        {company.job_profile} &bull; <span className="text-slate-400">{company.job_type}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold inline-block">
                        {formatLPA(company.package_lpa)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    {company.job_description || 'Full-time campus recruitment drive.'}
                  </p>

                  {/* Cutoff Criteria Matrix */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                    <div>
                      Min CGPA: <strong className="text-white">{company.minimum_cgpa ?? '6.00'}</strong>
                    </div>
                    <div>
                      Max Backlogs: <strong className="text-white">{company.maximum_backlogs ?? '0'}</strong>
                    </div>
                    <div>
                      10th Cutoff: <strong className="text-white">{company.minimum_10th ? `${company.minimum_10th}%` : 'Any'}</strong>
                    </div>
                    <div>
                      12th Cutoff: <strong className="text-white">{company.minimum_12th ? `${company.minimum_12th}%` : 'Any'}</strong>
                    </div>
                  </div>

                  {/* Branch and Location tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{company.location || 'Pan India'}</span>
                    </div>
                    {company.visit_date && (
                      <div className="flex items-center gap-1 text-slate-400 ml-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(company.visit_date)}</span>
                      </div>
                    )}
                  </div>

                  {/* ELIGIBILITY STATUS SECTION */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    {isEligible ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span className="font-semibold">
                          You meet all eligibility criteria for this position!
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-xs text-rose-300">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-rose-200 block font-bold">You are not eligible for this drive.</strong>
                              <span className="text-[11px] text-rose-300/80">
                                {company.eligibility_reasons?.length || 1} criterion did not match.
                              </span>
                            </div>
                          </div>

                          {company.eligibility_reasons && company.eligibility_reasons.length > 0 && (
                            <button
                              onClick={() => toggleReasonExpand(company.company_id)}
                              className="text-[11px] font-semibold text-rose-300 hover:text-white flex items-center gap-1 underline underline-offset-2 ml-2 shrink-0"
                            >
                              <span>{isExpanded ? 'Hide Reasons' : 'Why am I not eligible?'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        {/* Detailed Reasons Breakdown */}
                        {isExpanded && company.eligibility_reasons && company.eligibility_reasons.length > 0 && (
                          <div className="bg-slate-950/90 border border-rose-500/20 p-3.5 rounded-xl space-y-2 text-xs animate-in fade-in">
                            <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-rose-400" />
                              <span>Reason Breakdown:</span>
                            </div>
                            <ul className="space-y-1.5 pl-1">
                              {company.eligibility_reasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                                  <span className="text-rose-400 font-bold shrink-0">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Batch: <span className="text-slate-300">{company.allowed_year ? `Year ${company.allowed_year}` : 'All Batches'}</span>
                  </div>

                  {hasApplied ? (
                    <div className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Already Applied ({company.application_status || 'Applied'})</span>
                    </div>
                  ) : isEligible ? (
                    <button
                      onClick={() => setSelectedCompanyForApply(company)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/25 active:scale-95"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-800/60 text-slate-500 border border-slate-800 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-not-allowed"
                      title="You do not meet the eligibility cutoffs for this company"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Not Eligible</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JOB APPLICATION MODAL (Upload skills & resume) */}
      <JobApplicationModal
        isOpen={Boolean(selectedCompanyForApply)}
        onClose={() => setSelectedCompanyForApply(null)}
        company={selectedCompanyForApply}
        initialSkills={profile?.skills || []}
        initialResumeUrl={profile?.resume_url || ''}
        onSuccess={handleApplySuccess}
      />

      {/* ACADEMIC CRITERIA MODAL (Allow manual updates from header button) */}
      <AcademicCriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        allowClose={true}
        initialData={profile}
        onComplete={() => {
          setIsCriteriaModalOpen(false);
          fetchDrives();
        }}
      />
    </div>
  );
}
