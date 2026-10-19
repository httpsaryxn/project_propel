import React, { useState, useEffect } from 'react';
import { updateAcademicCriteria } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Award, BookOpen, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function AcademicCriteriaModal({ isOpen, onClose, onComplete, initialData, allowClose = false }) {
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    cgpa: '',
    tenth_percentage: '',
    twelfth_percentage: '',
    diploma_percentage: '0.00',
    active_backlogs: '0',
    total_backlogs: '0'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cgpa: initialData.cgpa ? String(initialData.cgpa) : '',
        tenth_percentage: initialData.tenth_percentage ? String(initialData.tenth_percentage) : '',
        twelfth_percentage: initialData.twelfth_percentage ? String(initialData.twelfth_percentage) : '',
        diploma_percentage: initialData.diploma_percentage ? String(initialData.diploma_percentage) : '0.00',
        active_backlogs: initialData.active_backlogs !== undefined ? String(initialData.active_backlogs) : '0',
        total_backlogs: initialData.total_backlogs !== undefined ? String(initialData.total_backlogs) : '0'
      });
    }
  }, [initialData]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cgpaNum = parseFloat(formData.cgpa);
    const tenthNum = parseFloat(formData.tenth_percentage);
    const twelfthNum = parseFloat(formData.twelfth_percentage);
    const diplomaNum = parseFloat(formData.diploma_percentage || '0');
    const activeBacklogsNum = parseInt(formData.active_backlogs || '0', 10);
    const totalBacklogsNum = parseInt(formData.total_backlogs || '0', 10);

    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setError('Please enter a valid CGPA between 0.00 and 10.00');
      return;
    }
    if (isNaN(tenthNum) || tenthNum < 0 || tenthNum > 100) {
      setError('Please enter a valid 10th percentage between 0 and 100');
      return;
    }
    if ((isNaN(twelfthNum) || twelfthNum <= 0) && (isNaN(diplomaNum) || diplomaNum <= 0)) {
      setError('Please provide either your 12th percentage or Diploma percentage');
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateAcademicCriteria({
        cgpa: cgpaNum,
        tenth_percentage: tenthNum,
        twelfth_percentage: isNaN(twelfthNum) ? 0 : twelfthNum,
        diploma_percentage: isNaN(diplomaNum) ? 0 : diplomaNum,
        active_backlogs: isNaN(activeBacklogsNum) ? 0 : activeBacklogsNum,
        total_backlogs: isNaN(totalBacklogsNum) ? 0 : totalBacklogsNum
      });

      if (res.success) {
        await refreshUser();
        if (onComplete) onComplete(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save academic criteria. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-blue-500/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {allowClose ? 'Update Academic Criteria' : 'First-Time Academic Setup'}
              </h2>
              <p className="text-xs text-slate-400">
                {allowClose ? 'Update your scores to recalculate drive eligibility' : 'Required once to calculate your company drive eligibility'}
              </p>
            </div>
          </div>
          {allowClose && onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-2xl mb-5 text-xs text-blue-200 leading-relaxed">
          💡 Please enter your verified academic scores. Companies will automatically match you against their CGPA, 10th %, 12th %, and backlog cutoffs.
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* CGPA */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Current Cumulative GPA (CGPA out of 10.00) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.65"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* 10th & 12th */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                10th Standard % *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="tenth_percentage"
                value={formData.tenth_percentage}
                onChange={handleChange}
                placeholder="e.g. 85.50"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                12th Standard %
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="twelfth_percentage"
                value={formData.twelfth_percentage}
                onChange={handleChange}
                placeholder="e.g. 82.00"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Diploma & Active Backlogs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Diploma % (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="diploma_percentage"
                value={formData.diploma_percentage}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                name="active_backlogs"
                value={formData.active_backlogs}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Total History Backlogs
              </label>
              <input
                type="number"
                min="0"
                name="total_backlogs"
                value={formData.total_backlogs}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Save Criteria & Unlock Applications</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
