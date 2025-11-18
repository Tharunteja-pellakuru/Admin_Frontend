
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { JobStatus } from '../types';
import { Edit, Trash2, Plus, Search, Archive, MapPin, Calendar, Briefcase, AlertTriangle } from 'lucide-react';

const JobsList = () => {
  const { jobs, deleteJob, updateJob } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToClose, setJobToClose] = useState(null);

  // Unique Departments
  const departments = Array.from(new Set(jobs.map(j => j.department)));

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    const matchesDept = filterDept === 'All' || job.department === filterDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const confirmDelete = () => {
      if (jobToDelete) {
          deleteJob(jobToDelete.id);
          setJobToDelete(null);
      }
  };

  const confirmClose = () => {
      if (jobToClose) {
          updateJob({ ...jobToClose, status: JobStatus.CLOSED });
          setJobToClose(null);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <Link
          to="/jobs/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30"
        >
          <Plus size={20} />
          Create Job
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select 
                value={filterDept} 
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
                <option value="All">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
                <option value="All">All Status</option>
                {Object.values(JobStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Job Title</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Posted</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                             {job.title}
                             {job.isFeatured && <span className="w-2 h-2 rounded-full bg-yellow-400" title="Featured"></span>}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Briefcase size={12} /> {job.type} • {job.workType}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{job.department}</td>
                    <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} /> {job.location}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide
                        ${job.status === JobStatus.PUBLISHED ? 'bg-green-50 text-green-600 border-green-200' : 
                          job.status === JobStatus.DRAFT ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                          'bg-red-50 text-red-600 border-red-200'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} /> {job.postedDate}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100">
                        {job.status !== JobStatus.CLOSED && (
                            <button
                                onClick={() => setJobToClose(job)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                title="Close Job"
                            >
                                <Archive size={18} />
                            </button>
                        )}
                        <Link to={`/jobs/${job.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-md transition-colors" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button 
                            onClick={() => setJobToDelete(job)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                    No jobs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing {filteredJobs.length} jobs</span>
            <div className="flex gap-2">
                <button disabled className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-400 disabled:opacity-50">Previous</button>
                <button disabled className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-400 disabled:opacity-50">Next</button>
            </div>
        </div>
      </div>

      {/* Close Job Modal */}
      {jobToClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Archive size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Close Job Posting?</h3>
                <p className="text-gray-500 mb-6 text-sm">
                    Are you sure you want to close <span className="font-bold text-gray-800">{jobToClose.title}</span>? 
                    This will prevent new applications.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setJobToClose(null)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmClose}
                        className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium shadow-lg shadow-amber-500/30 transition-colors"
                    >
                        Close Job
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Delete Job Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Job?</h3>
                <p className="text-gray-500 mb-6 text-sm">
                    Are you sure you want to delete <span className="font-bold text-gray-800">{jobToDelete.title}</span>? 
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setJobToDelete(null)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-lg shadow-red-500/30 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default JobsList;
