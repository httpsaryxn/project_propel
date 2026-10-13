import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';
import { UserCheck, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [roleTab, setRoleTab] = useState('student');
  const [formData, setFormData] = useState({
    roll_no: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    branch: 'Computer Engineering',
    current_year: 4,
    passout_year: 2026,
    location_zone: 'Western'
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);

      const payload =
        roleTab === 'coordinator'
          ? {
              email: formData.email,
              password: formData.password,
              role: 'coordinator'
            }
          : {
              ...formData,
              role: 'student',
              current_year: Number(formData.current_year),
              passout_year: Number(formData.passout_year)
            };

      const res = await registerUser(payload);

      if (res.success && res.data) {
        loginSession(res.data.user, res.data.token);
        if (res.data.user.role === 'coordinator') {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-xs text-slate-400">Register a new Student or Coordinator account</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setRoleTab('student')}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            roleTab === 'student'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Student</span>
        </button>
        <button
          type="button"
          onClick={() => setRoleTab('coordinator')}
          className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            roleTab === 'coordinator'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>T&P Coordinator</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email & Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {roleTab === 'coordinator' ? 'Official Coordinator Email *' : 'College Email *'}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={roleTab === 'coordinator' ? 'coordinator@college.edu' : 'student@college.edu'}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            required
            minLength={6}
          />
        </div>

        {/* Student Specific Fields */}
        {roleTab === 'student' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number *</label>
              <input
                type="text"
                name="roll_no"
                value={formData.roll_no}
                onChange={handleChange}
                placeholder="e.g. 101CS22005"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics Engineering">Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Passout Year *</label>
                <input
                  type="number"
                  name="passout_year"
                  value={formData.passout_year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location Zone</label>
                <select
                  name="location_zone"
                  value={formData.location_zone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Harbour">Harbour</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full mt-2 py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
            roleTab === 'coordinator'
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
          } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Create {roleTab === 'coordinator' ? 'Coordinator' : 'Student'} Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
