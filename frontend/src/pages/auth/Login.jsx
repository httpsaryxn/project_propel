import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { Lock, Mail, AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [roleTab, setRoleTab] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (selectedRole) => {
    setRoleTab(selectedRole);
    if (selectedRole === 'student') {
      setEmail('john.doe@student.edu');
      setPassword('password123');
    } else {
      setEmail('coordinator@college.edu');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login({ email, password });
      if (res.success && res.data) {
        loginSession(res.data.user, res.data.token);
        if (res.data.user.role === 'coordinator' || res.data.user.role === 'admin') {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-xs text-slate-400">Sign in to access your placement dashboard</p>
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

      {/* Demo Credentials Helper */}
      <div className="mb-6 bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
        <span className="text-slate-400">Need demo login?</span>
        <button
          type="button"
          onClick={() => handleDemoFill(roleTab)}
          className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
        >
          Auto-fill {roleTab === 'student' ? 'Student' : 'Coordinator'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={roleTab === 'student' ? 'john.doe@student.edu' : 'coordinator@college.edu'}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
            roleTab === 'student'
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
          } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In as {roleTab === 'student' ? 'Student' : 'Coordinator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
        Don't have a student account?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
          Register Student Profile
        </Link>
      </div>
    </div>
  );
}
