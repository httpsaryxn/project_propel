import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../services/companyService';
import CompanyModal from './CompanyModal';
import { formatLPA } from '../../utils/formatters';
import { Building2, Plus, Search, Filter, Edit3, Trash2, CheckCircle2, AlertCircle, MapPin, Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getCompanies({ search: searchQuery, status: statusFilter });
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchQuery, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      setError('');
      setSuccessMsg('');
      if (editingCompany) {
        const res = await updateCompany(editingCompany.company_id, formData);
        if (res.success) {
          setSuccessMsg(`Company "${formData.company_name}" updated successfully!`);
        }
      } else {
        const res = await createCompany(formData);
        if (res.success) {
          setSuccessMsg(`Company "${formData.company_name}" created successfully!`);
        }
      }
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      try {
        const res = await deleteCompany(companyId);
        if (res.success) {
          setSuccessMsg(`Company "${companyName}" deleted.`);
          fetchCompanies();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete company.');
      }
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

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Company Recruitment Drives</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage company profiles, package LPA offerings, HR contacts, and eligibility criteria
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hiring Drive</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search company by name or profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Drive Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-xs">
          No company recruitment drives found. Click "Add New Hiring Drive" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.company_id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-white leading-snug">
                      {company.company_name}
                    </h2>
                    <p className="text-xs font-medium text-indigo-400">
                      {company.job_profile} ({company.job_type})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {formatLPA(company.package_lpa)}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        company.status === 'Upcoming'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : company.status === 'Ongoing'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : company.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {company.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                  {company.job_description || 'No detailed description provided.'}
                </p>

                {/* Criteria Snippet */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-slate-400">
                    Min CGPA: <strong className="text-white">{company.minimum_cgpa ?? '6.00'}</strong>
                  </div>
                  <div className="text-slate-400">
                    Max Backlogs: <strong className="text-white">{company.maximum_backlogs ?? '0'}</strong>
                  </div>
                  <div className="text-slate-400">
                    Min 10th / 12th: <strong className="text-white">{company.minimum_10th ?? '60'}% / {company.minimum_12th ?? '60'}%</strong>
                  </div>
                  <div className="text-slate-400">
                    Gender Req: <strong className="text-white">{company.gender_requirement || 'Any'}</strong>
                  </div>
                </div>

                {/* Allowed Branches Tags */}
                {company.allowed_branches && company.allowed_branches.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {company.allowed_branches.map((b, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{company.location || 'Location Not Specified'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(company)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Drive Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.company_id, company.company_name)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Drive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Creation / Edit Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCompany}
      />
    </div>
  );
}
