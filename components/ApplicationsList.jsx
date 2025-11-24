
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { HIRING_STAGES } from '../constants';
import { Eye, Search, Filter, Star, Phone, Briefcase, ArrowRight, Calendar } from 'lucide-react';

const ApplicationsList = () => {
  const navigate = useNavigate();
  const { applications, jobs } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDepartment, setActiveDepartment] = useState('All');

  console.log(applications);

  // Helper to get department for an application
  const getDepartment = (jobId) => {
      const job = jobs.find(j => j.id === jobId);
      return job?.details?.department || 'Unknown';
  };

  const departments = Array.from(new Set(jobs.map(j => j.details?.department).filter(Boolean))).sort();
  const categories = ['All', 'Shortlisted', 'Rejected', 'Hired'];

  const getCategoryCount = (cat) => {
      if (cat === 'All') return applications.length;
      return applications.filter(app => app.status === cat).length;
  };

  const filteredApps = applications.filter(app => {
    const appDept = getDepartment(app.jobId);
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.status === activeCategory;
    const matchesDepartment = activeDepartment === 'All' || appDept === activeDepartment;
    
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  // Calculate progress for an app
  const getProgress = (stageId) => {
      const index = HIRING_STAGES.findIndex(s => s.id === stageId);
      return ((index + 1) / HIRING_STAGES.length) * 100;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Applications</h1>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-6">
              {categories.map(cat => {
                  const count = getCategoryCount(cat);
                  const isActive = activeCategory === cat;
                  return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2
                            ${isActive 
                                ? 'border-primary text-primary' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                      >
                          {cat}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                              {count}
                          </span>
                      </button>
                  );
              })}
          </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by candidate, job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={20} className="text-gray-500" />
            <select
                value={activeDepartment}
                onChange={(e) => setActiveDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="All">All Departments</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
            </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Job Applied</th>
                <th className="px-6 py-4 font-medium">Current Stage</th>
                <th className="px-6 py-4 font-medium">Stage Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                    const stageName = HIRING_STAGES.find(s => s.id === app.currentStage)?.name || 'Unknown';
                    const progress = getProgress(app.currentStage);
                    
                    return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{app.candidateName}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><Phone size={10}/> {app.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-800 max-w-xs truncate">{app.jobTitle}</div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                {getDepartment(app.jobId)}
                            </span>
                        </td>
                        <td className="px-6 py-4 min-w-[200px]">
                            <div className="text-sm text-gray-800 font-medium mb-1">{stageName}</div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${app.currentStageStatus === 'Rejected' ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded text-xs font-medium border
                              ${app.currentStageStatus === 'Cleared' ? 'bg-primary-50 text-primary-700 border-primary-200' : 
                                app.currentStageStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                app.currentStageStatus === 'On Hold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'}`}>
                              {app.currentStageStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{app.appliedDate}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Link 
                                    to={`/applications/${app.id}`}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors text-xs font-medium"
                                >
                                    <Eye size={12} /> View
                                </Link>
                                <button 
                                    onClick={() => navigate(`/applications/${app.id}`)}
                                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-md transition-colors text-xs font-medium"
                                >
                                    <ArrowRight size={12} /> Update
                                </button>
                            </div>
                        </td>
                    </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                    No applications found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Showing {filteredApps.length} results</span>
             <div className="flex gap-2">
                <button disabled className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
                <button disabled className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;
