import React, { useState } from 'react';
import { applyCompany } from '../../services/applicationService';
import { uploadResumeFile } from '../../services/studentService';
import { formatLPA } from '../../utils/formatters';
import { X, Building2, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Tag } from 'lucide-react';

export default function JobApplicationModal({ isOpen, onClose, company, initialSkills, initialResumeUrl, onSuccess }) {
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(initialSkills) ? initialSkills.join(', ') : (initialSkills || '')
  );
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl || '');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !company) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      setResumeFile(file);
      const res = await uploadResumeFile(file);
      if (res.success && res.data) {
        setResumeUrl(res.data.resume_url);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Resume upload failed. You can also provide a link below.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parsedSkills.length === 0) {
      setError('Please provide at least 1 key skill (e.g. React, Python, SQL)');
      return;
    }

    if (!resumeUrl && !resumeFile) {
      setError('Please upload your resume or provide a resume link.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        company_id: company.company_id,
        skills: parsedSkills,
        resume_url: resumeUrl,
        cover_note: coverNote
      };

      const res = await applyCompany(payload);
      if (res.success) {
        if (onSuccess) onSuccess(company.company_name);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Application submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{company.company_name}</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{company.job_profile}</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {formatLPA(company.package_lpa)}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Skills Tag Input */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span>Key Technical & Relevant Skills (comma separated) *</span>
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              These skills will be highlighted to the recruiting team for shortlisting.
            </p>
          </div>

          {/* Resume Upload / Link */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resume File or Online Portfolio / PDF URL *</span>
            </label>

            {/* File Upload Box */}
            <div className="border border-dashed border-slate-700 bg-slate-950/60 rounded-xl p-4 text-center hover:border-slate-600 transition-colors">
              <input
                type="file"
                id="resumeFileInput"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resumeFileInput" className="cursor-pointer block space-y-1">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="text-blue-400 font-semibold block">
                  {uploading ? 'Uploading resume...' : resumeFile ? `Selected: ${resumeFile.name}` : 'Click to upload resume (PDF, DOCX)'}
                </span>
                <span className="text-[10px] text-slate-500 block">Max 10MB</span>
              </label>
            </div>

            {/* Direct URL Input */}
            <div className="mt-2">
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="Or paste Google Drive / OneDrive / Cloud Resume Link"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-[11px]"
              />
            </div>
          </div>

          {/* Cover Note (Optional) */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Cover Note / Candidate Pitch (Optional)
            </label>
            <textarea
              rows="2"
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Briefly state why your background matches this profile..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Submit Application</span>
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
