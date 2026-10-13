import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, addCgpaRecord } from '../../services/studentService';
import { User, Mail, Phone, MapPin, Award, Edit3, Plus, ExternalLink, Linkedin, Github, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function StudentProfile() {
  const { user, loginSession, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Add CGPA Modal state
  const [isCgpaModalOpen, setIsCgpaModalOpen] = useState(false);
  const [cgpaForm, setCgpaForm] = useState({ semester: 1, sgpa: '', cgpa: '' });

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const openEditModal = () => {
    if (profileData) {
      setEditForm({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        personal_email: profileData.personal_email || '',
        phone: profileData.phone || '',
        gender: profileData.gender || 'Male',
        address: profileData.address || '',
        location_zone: profileData.location_zone || 'Western',
        resume_url: profileData.resume_url || '',
        linkedin_url: profileData.linkedin_url || '',
        github_url: profileData.github_url || '',
        skills: profileData.skills ? profileData.skills.join(', ') : ''
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const skillsArray = editForm.skills
        ? editForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await updateProfile({
        ...editForm,
        skills: skillsArray
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        setIsEditModalOpen(false);
        fetchStudentProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleCgpaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await addCgpaRecord({
        semester: Number(cgpaForm.semester),
        sgpa: Number(cgpaForm.sgpa),
        cgpa: Number(cgpaForm.cgpa)
      });

      if (res.success) {
        setSuccessMsg(`Semester ${cgpaForm.semester} CGPA record saved!`);
        setIsCgpaModalOpen(false);
        fetchStudentProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add CGPA record.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-400 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-bold">
            {profileData?.first_name ? profileData.first_name[0] : 'S'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {profileData?.first_name} {profileData?.last_name}
            </h1>
            <p className="text-xs text-slate-400">
              {profileData?.branch} • Roll No: <strong className="text-white">{profileData?.roll_no}</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                Year {profileData?.current_year} ({profileData?.passout_year} Passout)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                Zone: {profileData?.location_zone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={openEditModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Personal Info */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-blue-400" />
            <span>Contact & Location Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">College Email</span>
              <span className="text-slate-200 font-medium">{profileData?.college_email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Personal Email</span>
              <span className="text-slate-200 font-medium">{profileData?.personal_email || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Phone Number</span>
              <span className="text-slate-200 font-medium">{profileData?.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Gender</span>
              <span className="text-slate-200 font-medium">{profileData?.gender}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Residential Address</span>
              <span className="text-slate-200 font-medium text-right max-w-xs">{profileData?.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Resume & Social Links */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Resume & Portfolios</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Resume Document</span>
              </div>
              {profileData?.resume_url ? (
                <a
                  href={profileData.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View Resume</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-500">Not Uploaded</span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Linkedin className="w-4 h-4 text-blue-500" />
                <span>LinkedIn Profile</span>
              </div>
              {profileData?.linkedin_url ? (
                <a
                  href={profileData.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-500">Not Provided</span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Github className="w-4 h-4 text-slate-200" />
                <span>GitHub Profile</span>
              </div>
              {profileData?.github_url ? (
                <a
                  href={profileData.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>View GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-500">Not Provided</span>
              )}
            </div>

            {/* Skills */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-400 mb-2">Technical Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {profileData?.skills && profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-200 text-[11px] rounded-lg border border-slate-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">No skill tags added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Edit Profile Information</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Personal Email</label>
                  <input
                    type="email"
                    value={editForm.personal_email}
                    onChange={(e) => setEditForm({ ...editForm, personal_email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Location Zone</label>
                  <select
                    value={editForm.location_zone}
                    onChange={(e) => setEditForm({ ...editForm, location_zone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Western">Western</option>
                    <option value="Central">Central</option>
                    <option value="Harbour">Harbour</option>
                    <option value="Navi Mumbai">Navi Mumbai</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Residential Address</label>
                <textarea
                  rows="2"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Resume Link (PDF URL)</label>
                <input
                  type="url"
                  value={editForm.resume_url}
                  onChange={(e) => setEditForm({ ...editForm, resume_url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editForm.linkedin_url}
                    onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editForm.github_url}
                    onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="JavaScript, PostgreSQL, React, Node.js"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
