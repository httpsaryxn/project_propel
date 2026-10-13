import React, { useState, useEffect } from 'react';
import { X, Building2, UserCheck, ShieldCheck, MapPin, CheckSquare, Square } from 'lucide-react';

export default function CompanyModal({ isOpen, onClose, onSubmit, initialData }) {
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    company_name: '',
    job_profile: '',
    job_description: '',
    package_lpa: '',
    job_type: 'Full-Time',
    location: '',
    visit_date: '',
    hr_name: '',
    hr_email: '',
    hr_contact: '',
    status: 'Upcoming',
    minimum_cgpa: '6.00',
    maximum_backlogs: '0',
    minimum_10th: '60.00',
    minimum_12th: '60.00',
    minimum_diploma: '60.00',
    allowed_year: 4,
    gender_requirement: 'Any',
    allowed_branches: ['Computer Engineering', 'Information Technology'],
    allowed_locations: ['Western', 'Central', 'Navi Mumbai']
  });

  const availableBranches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const availableLocations = ['Western', 'Central', 'Harbour', 'Navi Mumbai', 'Other'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || '',
        job_profile: initialData.job_profile || '',
        job_description: initialData.job_description || '',
        package_lpa: initialData.package_lpa || '',
        job_type: initialData.job_type || 'Full-Time',
        location: initialData.location || '',
        visit_date: initialData.visit_date ? initialData.visit_date.split('T')[0] : '',
        hr_name: initialData.hr_name || '',
        hr_email: initialData.hr_email || '',
        hr_contact: initialData.hr_contact || '',
        status: initialData.status || 'Upcoming',
        minimum_cgpa: initialData.minimum_cgpa || '6.00',
        maximum_backlogs: initialData.maximum_backlogs || '0',
        minimum_10th: initialData.minimum_10th || '60.00',
        minimum_12th: initialData.minimum_12th || '60.00',
        minimum_diploma: initialData.minimum_diploma || '60.00',
        allowed_year: initialData.allowed_year || 4,
        gender_requirement: initialData.gender_requirement || 'Any',
        allowed_branches: initialData.allowed_branches || ['Computer Engineering', 'Information Technology'],
        allowed_locations: initialData.allowed_locations || ['Western', 'Central']
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const toggleBranch = (branch) => {
    setFormData((prev) => {
      const branches = prev.allowed_branches.includes(branch)
        ? prev.allowed_branches.filter((b) => b !== branch)
        : [...prev.allowed_branches, branch];
      return { ...prev, allowed_branches: branches };
    });
  };

  const toggleLocation = (loc) => {
    setFormData((prev) => {
      const locs = prev.allowed_locations.includes(loc)
        ? prev.allowed_locations.filter((l) => l !== loc)
        : [...prev.allowed_locations, loc];
      return { ...prev, allowed_locations: locs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      visit_date: formData.visit_date && formData.visit_date.trim() !== '' ? formData.visit_date : null,
      package_lpa: Number(formData.package_lpa),
      minimum_cgpa: Number(formData.minimum_cgpa),
      maximum_backlogs: Number(formData.maximum_backlogs),
      minimum_10th: Number(formData.minimum_10th),
      minimum_12th: Number(formData.minimum_12th),
      minimum_diploma: Number(formData.minimum_diploma),
      allowed_year: Number(formData.allowed_year)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base">
            {initialData ? 'Edit Company Hiring Drive' : 'Add New Hiring Company'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'basic' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            1. Drive Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hr')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'hr' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            2. HR Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'criteria' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            3. Criteria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'branches' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            4. Branches & Zones
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Tab 1: Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Job Profile *</label>
                  <input
                    type="text"
                    value={formData.job_profile}
                    onChange={(e) => setFormData({ ...formData, job_profile: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Package LPA (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.package_lpa}
                    onChange={(e) => setFormData({ ...formData, package_lpa: e.target.value })}
                    placeholder="12.50"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="PPO">PPO</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Drive Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Mumbai / Bangalore / Remote"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Visit / Drive Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Job Description</label>
                <textarea
                  rows="3"
                  value={formData.job_description}
                  onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                  placeholder="Overview of roles, responsibilities, and skill requirements..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* Tab 2: HR Details */}
          {activeTab === 'hr' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">HR Representative Name</label>
                <input
                  type="text"
                  value={formData.hr_name}
                  onChange={(e) => setFormData({ ...formData, hr_name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">HR Email Address</label>
                  <input
                    type="email"
                    value={formData.hr_email}
                    onChange={(e) => setFormData({ ...formData, hr_email: e.target.value })}
                    placeholder="hr@company.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HR Phone Contact</label>
                  <input
                    type="text"
                    value={formData.hr_contact}
                    onChange={(e) => setFormData({ ...formData, hr_contact: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Criteria Config */}
          {activeTab === 'criteria' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Minimum CGPA required (0.00 – 10.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_cgpa}
                    onChange={(e) => setFormData({ ...formData, minimum_cgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Maximum Allowed Backlogs</label>
                  <input
                    type="number"
                    value={formData.maximum_backlogs}
                    onChange={(e) => setFormData({ ...formData, maximum_backlogs: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Min 10th %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_10th}
                    onChange={(e) => setFormData({ ...formData, minimum_10th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min 12th %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_12th}
                    onChange={(e) => setFormData({ ...formData, minimum_12th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min Diploma %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_diploma}
                    onChange={(e) => setFormData({ ...formData, minimum_diploma: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Gender Requirement</label>
                  <select
                    value={formData.gender_requirement}
                    onChange={(e) => setFormData({ ...formData, gender_requirement: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Any">Any Gender</option>
                    <option value="Female">Female Only</option>
                    <option value="Male">Male Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Allowed Study Year</label>
                  <select
                    value={formData.allowed_year}
                    onChange={(e) => setFormData({ ...formData, allowed_year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={4}>4th Year (Final Year)</option>
                    <option value={3}>3rd Year (Pre-Final)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Allowed Branches & Locations */}
          {activeTab === 'branches' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-2 font-semibold">Eligible Engineering Branches</label>
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {availableBranches.map((branch) => {
                    const isSelected = formData.allowed_branches.includes(branch);
                    return (
                      <div
                        key={branch}
                        onClick={() => toggleBranch(branch)}
                        className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white select-none py-1"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                        <span>{branch}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-semibold">Allowed Student Residential Zones</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {availableLocations.map((loc) => {
                    const isSelected = formData.allowed_locations.includes(loc);
                    return (
                      <div
                        key={loc}
                        onClick={() => toggleLocation(loc)}
                        className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white select-none py-1"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                        <span>{loc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-500">
              * Fill required info across all tabs before saving
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
              >
                {initialData ? 'Update Company Drive' : 'Create Hiring Drive'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
