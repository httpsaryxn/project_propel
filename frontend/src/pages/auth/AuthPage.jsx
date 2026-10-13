import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, registerUser } from '../../services/authService';
import { UserCheck, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, LogIn, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  // Main Section State: 'login' vs 'register'
  const [mainMode, setMainMode] = useState(location.pathname === '/register' ? 'register' : 'login');

  // Role Selection for Registration Only: 'student' vs 'coordinator'
  const [registerRoleTab, setRegisterRoleTab] = useState('student');

  // Common Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student specific registration state
  const [studentForm, setStudentForm] = useState({
    roll_no: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: 'Male',
    branch: 'Computer Engineering',
    current_year: 4,
    passout_year: 2026,
    location_zone: 'Western'
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.pathname === '/register') {
      setMainMode('register');
    } else if (location.pathname === '/login') {
      setMainMode('login');
    }
  }, [location.pathname]);

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setSubmitting(true);

      if (mainMode === 'login') {
        // --- UNIFIED SIGN IN FLOW ---
        // Automatically detects role from registered database account
        const res = await login({ email, password });
        if (res.success && res.data) {
          loginSession(res.data.user, res.data.token);
          const userRole = res.data.user.role ? res.data.user.role.toLowerCase() : 'student';
          if (userRole === 'coordinator' || userRole === 'admin') {
            navigate('/coordinator/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      } else {
        // --- CREATE ACCOUNT FLOW ---
        const payload =
          registerRoleTab === 'coordinator'
            ? {
                email,
                password,
                role: 'coordinator'
              }
            : {
                ...studentForm,
                email,
                password,
                role: 'student',
                current_year: Number(studentForm.current_year),
                passout_year: Number(studentForm.passout_year)
              };

        const res = await registerUser(payload);
        if (res.success && res.data) {
          loginSession(res.data.user, res.data.token);
          const userRole = res.data.user.role ? res.data.user.role.toLowerCase() : 'student';
          if (userRole === 'coordinator' || userRole === 'admin') {
            navigate('/coordinator/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
      {/* 1. MAIN SECTION TOGGLE: Sign In vs Create Account */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => { setMainMode('login'); setError(''); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mainMode === 'login'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </button>
        <button
          type="button"
          onClick={() => { setMainMode('register'); setError(''); }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mainMode === 'register'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Title & Description */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">
          {mainMode === 'login' ? 'Welcome Back' : 'Register New Account'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {mainMode === 'login'
            ? 'Enter your credentials to automatically access your registered role'
            : 'Select your account type to register'}
        </p>
      </div>

      {/* Sub-Section Selection ONLY for Create Account */}
      {mainMode === 'register' && (
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setRegisterRoleTab('student')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              registerRoleTab === 'student'
                ? 'bg-slate-800 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Registration</span>
          </button>
          <button
            type="button"
            onClick={() => setRegisterRoleTab('coordinator')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              registerRoleTab === 'coordinator'
                ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Coordinator Registration</span>
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email & Password (Common to all logins) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@college.edu or name@vit.edu.in"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Extra Registration Fields for Student */}
        {mainMode === 'register' && registerRoleTab === 'student' && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number *</label>
              <input
                type="text"
                name="roll_no"
                value={studentForm.roll_no}
                onChange={handleStudentChange}
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
                  value={studentForm.first_name}
                  onChange={handleStudentChange}
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
                  value={studentForm.last_name}
                  onChange={handleStudentChange}
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
                  value={studentForm.branch}
                  onChange={handleStudentChange}
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
                  value={studentForm.passout_year}
                  onChange={handleStudentChange}
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
                  value={studentForm.gender}
                  onChange={handleStudentChange}
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
                  value={studentForm.location_zone}
                  onChange={handleStudentChange}
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
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
            mainMode === 'login'
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              : registerRoleTab === 'coordinator'
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
          } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>
                {mainMode === 'login'
                  ? 'Sign In to Portal'
                  : `Create ${registerRoleTab === 'coordinator' ? 'Coordinator' : 'Student'} Account`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
