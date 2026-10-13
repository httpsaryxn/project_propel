import React, { useState, useEffect } from 'react';
import { getAllStudents } from '../../services/studentService';
import { Users, Search, Filter, ExternalLink, GraduationCap, MapPin, Eye, X } from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getAllStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      setError('Failed to fetch student registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.roll_no.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Student Registry & Profiles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse registered students, academic branches, passout batches, and resumes
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, roll no, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Registry Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading student registry...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-xs">
          No student records matching your search.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Year / Batch</th>
                  <th className="p-4">Location Zone</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.student_id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-white">{s.roll_no}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{s.first_name} {s.last_name}</div>
                      <div className="text-[10px] text-slate-500">{s.college_email}</div>
                    </td>
                    <td className="p-4 text-slate-300">{s.branch}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-[10px]">
                        Year {s.current_year} ({s.passout_year})
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{s.location_zone}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Profile Inspector Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Student Profile Inspector</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {selectedStudent.first_name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedStudent.first_name} {selectedStudent.last_name}</h4>
                  <p className="text-slate-400">Roll No: <strong className="text-white">{selectedStudent.roll_no}</strong></p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">College Email</span>
                  <span className="text-slate-200 font-medium">{selectedStudent.college_email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-200 font-medium">{selectedStudent.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Branch</span>
                  <span className="text-slate-200 font-medium">{selectedStudent.branch}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Passout Batch</span>
                  <span className="text-slate-200 font-medium">{selectedStudent.passout_year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Zone</span>
                  <span className="text-slate-200 font-medium">{selectedStudent.location_zone}</span>
                </div>
              </div>

              {selectedStudent.resume_url && (
                <div className="pt-2">
                  <a
                    href={selectedStudent.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-semibold rounded-xl flex items-center justify-center gap-2 border border-indigo-500/30"
                  >
                    <span>Open Resume Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
