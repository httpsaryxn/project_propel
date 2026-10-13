import React, { useState, useEffect } from 'react';
import { getCompanies } from '../../services/companyService';
import { getCompanyResults, updateResult } from '../../services/resultService';
import { Award, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CoordinatorResults() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const fetchResults = async () => {
    if (!selectedCompanyId) return;
    try {
      setLoading(true);
      const res = await getCompanyResults(selectedCompanyId);
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      setError('Failed to fetch selection round results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesList();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchResults();
    }
  }, [selectedCompanyId]);

  const handleRoundChange = async (studentId, field, value, currentRow) => {
    try {
      setError('');
      setSuccessMsg('');

      const updatedPayload = {
        student_id: studentId,
        company_id: Number(selectedCompanyId),
        round_1: currentRow.round_1 || 'Pending',
        round_2: currentRow.round_2 || 'Pending',
        technical: currentRow.technical || 'Pending',
        hr: currentRow.hr || 'Pending',
        final_result: currentRow.final_result || 'Pending',
        [field]: value
      };

      const res = await updateResult(updatedPayload);
      if (res.success) {
        setSuccessMsg(
          value === 'Selected'
            ? 'Candidate marked as Selected! Official offer letter auto-generated.'
            : 'Evaluation round updated.'
        );
        fetchResults();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update result.');
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
            <Award className="w-5 h-5 text-amber-400" />
            <span>Selection Rounds & Placement Results Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track candidates across Round 1, Round 2, Technical, HR, and Final Selection. Selecting a candidate automatically generates an offer letter.
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

      {/* Results Matrix Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading selection rounds...</div>
      ) : results.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-xs">
          No candidates found for {selectedCompany?.company_name || 'this company'}.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Round 1</th>
                  <th className="p-4">Round 2</th>
                  <th className="p-4">Technical Round</th>
                  <th className="p-4">HR Round</th>
                  <th className="p-4 text-right">Final Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {results.map((r) => (
                  <tr key={r.student_id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-white">{r.roll_no}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{r.first_name} {r.last_name}</div>
                      <div className="text-[10px] text-slate-500">{r.branch}</div>
                    </td>

                    {/* Round 1 */}
                    <td className="p-4">
                      <select
                        value={r.round_1 || 'Pending'}
                        onChange={(e) => handleRoundChange(r.student_id, 'round_1', e.target.value, r)}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Round 2 */}
                    <td className="p-4">
                      <select
                        value={r.round_2 || 'Pending'}
                        onChange={(e) => handleRoundChange(r.student_id, 'round_2', e.target.value, r)}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Technical */}
                    <td className="p-4">
                      <select
                        value={r.technical || 'Pending'}
                        onChange={(e) => handleRoundChange(r.student_id, 'technical', e.target.value, r)}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* HR */}
                    <td className="p-4">
                      <select
                        value={r.hr || 'Pending'}
                        onChange={(e) => handleRoundChange(r.student_id, 'hr', e.target.value, r)}
                        className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Final Result */}
                    <td className="p-4 text-right">
                      <select
                        value={r.final_result || 'Pending'}
                        onChange={(e) => handleRoundChange(r.student_id, 'final_result', e.target.value, r)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold focus:outline-none bg-slate-950 border ${
                          r.final_result === 'Selected'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : r.final_result === 'Rejected'
                            ? 'text-rose-400 border-rose-500/40'
                            : 'text-white border-slate-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Selected">Selected 🎉</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
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
