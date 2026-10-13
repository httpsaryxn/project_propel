import React, { useState, useEffect } from 'react';
import { getCompanies } from '../../services/companyService';
import { getCompanyApplications, updateStatus, bulkUpdateStatus } from '../../services/applicationService';
import { FileSpreadsheet, Building2, CheckSquare, Square, Filter, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function CoordinatorApplications() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Bulk selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchCompaniesList = async () => {
    try {
      const res = await getCompanies();
      if (res.success && res.data && res.data.length > 0) {
        setCompanies(res.data);
        setSelectedCompanyId(res.data[0].company_id);
      }
    } catch (err) {
      setError('Failed to fetch companies list.');
    }
  };

  const fetchApplications = async () => {
    if (!selectedCompanyId) return;
    try {
      setLoading(true);
      const res = await getCompanyApplications(selectedCompanyId);
      if (res.success && res.data) {
        setApplications(res.data);
        setSelectedStudentIds([]);
      }
    } catch (err) {
      setError('Failed to fetch company applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesList();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchApplications();
    }
  }, [selectedCompanyId]);

  const handleSelectAll = () => {
    if (selectedStudentIds.length === applications.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(applications.map((a) => a.student_id));
    }
  };

  const toggleSelectStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSingleStatusChange = async (applicationId, newStatus) => {
    try {
      setError('');
      setSuccessMsg('');
      const res = await updateStatus(applicationId, newStatus);
      if (res.success) {
        setSuccessMsg(`Status updated to "${newStatus}"`);
        fetchApplications();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleBulkAction = async (newStatus) => {
    if (selectedStudentIds.length === 0) {
      setError('Please select at least one student for bulk action.');
      return;
    }

    try {
      setError('');
      setSuccessMsg('');
      const res = await bulkUpdateStatus(selectedCompanyId, selectedStudentIds, newStatus);
      if (res.success) {
        setSuccessMsg(`Updated status to "${newStatus}" for ${selectedStudentIds.length} students.`);
        fetchApplications();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Bulk status update failed.');
    }
  };

  const selectedCompany = companies.find((c) => c.company_id === Number(selectedCompanyId));

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

      {/* Header & Company Selector */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Applicant Management & Shortlisting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review student applicants, update selection round progress, and perform bulk shortlisting
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Select Company Hiring Drive
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {companies.map((c) => (
              <option key={c.company_id} value={c.company_id}>
                {c.company_name} — {c.job_profile} ({c.package_lpa} LPA)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-indigo-950/80 border border-indigo-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-indigo-200 font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span>{selectedStudentIds.length} Applicants Selected</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleBulkAction('Shortlisted')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
            >
              Bulk Shortlist
            </button>
            <button
              onClick={() => handleBulkAction('Interviewing')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg"
            >
              Bulk Interviewing
            </button>
            <button
              onClick={() => handleBulkAction('Selected')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
            >
              Bulk Select
            </button>
            <button
              onClick={() => handleBulkAction('Rejected')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg"
            >
              Bulk Reject
            </button>
          </div>
        </div>
      )}

      {/* Applicants Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading applicants...</div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-xs">
          No student applications received for {selectedCompany?.company_name || 'this company'} yet.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 w-10">
                    <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                      {selectedStudentIds.length === applications.length ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Latest CGPA</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => {
                  const isChecked = selectedStudentIds.includes(app.student_id);
                  return (
                    <tr key={app.application_id} className={`hover:bg-slate-850/50 transition-colors ${isChecked ? 'bg-indigo-950/20' : ''}`}>
                      <td className="p-4">
                        <button onClick={() => toggleSelectStudent(app.student_id)} className="text-slate-400 hover:text-white">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-mono font-semibold text-white">{app.roll_no}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{app.first_name} {app.last_name}</div>
                        <div className="text-[10px] text-slate-500">{app.college_email}</div>
                      </td>
                      <td className="p-4 text-slate-300">{app.branch}</td>
                      <td className="p-4">
                        <span className="font-bold text-indigo-400">{Number(app.latest_cgpa).toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-slate-400">{formatDate(app.applied_on)}</td>
                      <td className="p-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleSingleStatusChange(app.application_id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 text-white"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
